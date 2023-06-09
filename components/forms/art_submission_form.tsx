import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, updateMetadata, uploadBytes } from 'firebase/storage';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useRef } from 'react';
import { db, storage } from '../../scripts/firebase';

import { getLogger } from "../../logging/log-util";
import resizeImage from '../../scripts/image_resizing';
import TagsListCheckboxes from './tags_list_checkboxes';

const logger = getLogger("dashboard");

import Image from 'next/image';
import styles from "./form.module.css";

import { activityCollection, artCollection, tagsCollection } from '../../collection_names';
import { ArtInterface, RecentActivityInterface, TagDataInterface, UploadRecentActivityInterface } from '../../interfaces/firebase_interfaces';
import { testResize } from './form_utils';
import { getCurrentUnixTimestamp, getTodaysDate } from '../../scripts/utils';
import newMetadata from '../../scripts/firebase_storage_metadata';

const saveNewTag = async (tagData: TagDataInterface) => {
    logger.debug("tagData", tagData)
    try {
        await addDoc(collection(db, tagsCollection), tagData)
        logger.info("Successfully added ", tagData.name)
    } catch (error) {
        logger.error(error)
        alert('failed to add new tag')
    }
}

/**
 * Processes the new tags and adds it to the existing array if it isn't already there.
 * @param newTagsArray 
 * @param tagsArray 
 */
function addTags(newTagsArray: Array<string>, tagsArray: Array<string>) {
    for (const tag of newTagsArray) {
        if (!tagsArray.includes(tag) && tag.length > 0) {
            tagsArray.push(tag);
            saveNewTag({ name: tag })
            logger.debug("Adding tag:", tag)
        }
    }
}

async function addRecentActivity(name: string, action: string, tags?: Array<string>, dump?: boolean) {
    logger.info("Attempting to addRecentActivity")

    let type = "art"

    if (action != "delete" && tags) {
        if (dump) {
            type = "misc"
        } else if (tags.includes(process.env.DIGITAL_GALLERY_TAG!)) {
            type = process.env.DIGITAL_GALLERY_TAG!
        } else if (tags.includes(process.env.TRADITIONAL_GALLERY_TAG!)) {
            type = process.env.TRADITIONAL_GALLERY_TAG!
        }
    }

    let uploadActivity: UploadRecentActivityInterface = {
        action: action,
        type: type,
        title: name,
        collection: artCollection,
        date_created: getTodaysDate()
    }
    logger.info("GAHH to addRecentActivity", uploadActivity, activityCollection)

    try {
        logger.debug("activityCollection...", activityCollection)
        await addDoc(collection(db, activityCollection), uploadActivity)
        logger.info(`Added ${action} activity`)


    } catch (error) {
        logger.error(error)
        alert('Failed to add to addRecentActivity')
    }
}

async function deleteArtData(id: string, name: string) {
    logger.debug("DELETE", id)
    try {
        const docRef = doc(db, artCollection, id);
        await deleteDoc(docRef)
        logger.info("Successfully deleted... Going back to dashboard...")
        await addRecentActivity(name, "delete")
        window.location.reload();

    } catch (error) {
        logger.error(error)
        alert('Failed to delete the data')
    }
}

interface UploadArtInterface {
    id?: string,
    name: string,
    date_created: string,
    description: string,
    pinned: boolean,
    dump: boolean,
    url?: string,
    image?: Blob,
    tagsArray: Array<string>,
    linkText?: string,
    linkUrl?: string
}

interface UploadImageAndSaveProps {
    id: string,
    name: string,
    date_created: string,
    description: string,
    pinned: boolean,
    dump: boolean,
    image: Blob,
    tagsArray: Array<string>,
    linkText: string,
    linkUrl: string
}

async function uploadImageAndSave({ id, name, date_created, description, pinned, dump, image, tagsArray, linkText, linkUrl }: UploadImageAndSaveProps) {
    logger.debug("uploadImageAndSave...", name, description)
    const storageRef = ref(storage, `${artCollection}/${image.name}-${name}-${getCurrentUnixTimestamp()}`)
    // UPDATE METADATA

    try {
        // Update metadata properties

        const data = await resizeImage({ imageFile: image })
        logger.info("uploadImageAndSave Done!", data);

        if (data.blob && data.dataUrl) {
            const snapshot = await uploadBytes(storageRef, data.blob);

            logger.info("Obtained snapshot")
            const downloadUrl = await getDownloadURL(snapshot.ref);
            let results = await updateMetadata(storageRef, newMetadata)
            logger.info("Updated metadata", results)

            logger.info("Obtained downloadUrl")
            await saveOrEditData({ id, name, description, tagsArray, date_created, pinned, dump, url: downloadUrl, linkText, linkUrl });
        }

    } catch (error) {
        logger.error(error);
        let btn = document.getElementById("submit-button") as HTMLButtonElement;
        if (btn) {
            alert("Could not save...");
            btn.disabled = false;
        }
    }
}


/**
 * Will either save or edit the data. Will edit the data if artData has an id
 * @param {*} artData 
 */
async function saveOrEditData(artData: UploadArtInterface) {
    logger.debug("artData", artData)
    delete artData.image

    try {
        if (artData.id) {
            logger.info("We're gonna set a doc instead of add one since we have...", artData.id)
            const docRef = doc(db, artCollection, artData.id);
            delete artData.id

            logger.debug("Final data..", artData)
            await setDoc(docRef, artData)
            logger.info("Successfully edited... Reloading...")
            await addRecentActivity(artData.name, "edit", artData.tagsArray, artData.dump)

        } else {
            delete artData.id

            await addDoc(collection(db, artCollection), artData)
            logger.info("Successfully added to art collection... Either need to refresh or wait for update.")
            await addRecentActivity(artData.name, "upload", artData.tagsArray, artData.dump)

        }
        window.location.reload();

    } catch (error) {
        logger.error(error)
        alert('Failed to add the data')
    }
}

function saveArtData(editMode: boolean, data: UploadArtInterface, image?: File) {
    if (editMode) {
        if (!image) {
            logger.warn("No image found... so we're not editing the image");
            saveOrEditData(data); // Go straight into editing the data...
        } else if (data.id && data.image) {
            const newData = data as UploadImageAndSaveProps;
            uploadImageAndSave(newData);
        }
    } else if (data && data.image) {
        const newData = data as UploadImageAndSaveProps;
        uploadImageAndSave(newData);
    } else {
        logger.warn("Nothing is being uploaded...");
    }
}

interface ArtSubmissionFormProps {
    editMode?: boolean,
    existingData?: ArtInterface
}

export default function ArtSubmissionForm({ editMode = false, existingData }: ArtSubmissionFormProps) {

    const imageInput = useRef<HTMLInputElement | null>(null);
    const nameInput = useRef<HTMLInputElement | null>(null);
    const dateCreatedInput = useRef<HTMLInputElement | null>(null);
    const descriptionInput = useRef<HTMLTextAreaElement | null>(null);
    const newTagsInput = useRef<HTMLInputElement | null>(null);
    const pinnedInput = useRef<HTMLInputElement | null>(null);
    const dumpInput = useRef<HTMLInputElement | null>(null);
    const checkedTags = useRef<Array<string>>([]);
    const linkTextInput = useRef<HTMLInputElement | null>(null);
    const linkUrlInput = useRef<HTMLInputElement | null>(null);

    function prefillTags() {
        logger.debug("Prefilling...", checkedTags.current)
        checkedTags.current.forEach(tag => {
            const tagElement = document.getElementById(`tag-${tag}`) as HTMLInputElement;
            if (tagElement) {
                tagElement.checked = true;
            }
        });

    }

    useEffect(() => {
        if (editMode && existingData) { // Prefill fields with existing data
            nameInput.current!.value = existingData.name
            dateCreatedInput.current!.value = existingData.date_created
            descriptionInput.current!.value = existingData.description
            pinnedInput.current!.checked = existingData.pinned
            dumpInput.current!.checked = existingData.dump
            checkedTags.current = existingData.tagsArray
            linkTextInput.current!.value = existingData.linkText
            linkUrlInput.current!.value = existingData.linkUrl
            prefillTags()
        }
    }, [existingData])


    function submitArt(e: FormEvent<HTMLFormElement>) {
        logger.debug("Checked tags:", checkedTags.current)
        e.preventDefault();

        let btn = document.getElementById("submit-button") as HTMLButtonElement;
        btn.disabled = true;

        const name = nameInput.current!.value;
        const date_created = dateCreatedInput.current!.value;
        const description = descriptionInput.current!.value;
        const newTags = newTagsInput.current!.value;
        const pinned = pinnedInput.current!.checked;
        const dump = dumpInput.current!.checked;
        const linkText = linkTextInput.current!.value;
        const linkUrl = linkUrlInput.current!.value;

        let newTagsArray = newTags.split(",").map(tag => tag.trim());

        addTags(newTagsArray, checkedTags.current);

        let data: UploadArtInterface = { name, date_created, description, tagsArray: checkedTags.current, pinned, dump, linkText, linkUrl}
        if (editMode && existingData) {
            data.id = existingData.id
            data.url = existingData.url
        }

        logger.debug("UploadArtInterface", data)

        let image;
        image = imageInput.current?.files![0];
        if (image) {
            data.image = image
        }

        saveArtData(editMode, data, image)
    }

    function removeUploadedImage() {
        imageInput.current!.value = "";
    }

    function handleTestResize() {
        testResize(imageInput.current?.files![0])
    }

    function handleDelete(e: MouseEvent<HTMLButtonElement>) {
        const button = e.currentTarget;
        button.disabled = true;

        let result = confirm("Are you sure you want to delete this?");
        if (result && existingData) {
            deleteArtData(existingData.id, existingData.name)
        } else {
            button.disabled = false;
        }
    }


    function checkboxHandler(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            checkedTags.current.push(e.target.value);
        } else {
            // Remove
            const index = checkedTags.current.indexOf(e.target.value);
            if (index > -1) {
                checkedTags.current.splice(index, 1);
            } else {
                logger.warn("Attempted to remove a tag that wasn't there.")
            }
        }
        logger.info("Tags was updated:", checkedTags.current)
    }

    return (
        <div>
            <form className={styles.form} onSubmit={submitArt}>

                {
                    editMode && existingData ? <Image src={existingData.url} width={100} height={100} alt={existingData.name} /> : null
                }

                {
                    !editMode ?
                        <p className={`${styles.required} ${styles.field}`}>
                            <label>Image</label><input name='image' ref={imageInput} type="file" placeholder="Image" required />
                        </p>
                        :
                        <p className={`${styles} ${styles.field}`}>
                            <label>Image </label><small><i>Note: This will overwrite the current image above.</i></small><br /><input name='image' ref={imageInput} type="file" placeholder="Image" />
                        </p>
                }

                {
                    editMode ? <button className='cool-button-red centred' type="button" onClick={removeUploadedImage}>Remove image</button> : null
                }


                <div id="resized-image"></div>
                <button className='cool-button centred' type="button" onClick={handleTestResize}>Test Resize</button>


                <p className={`${styles.required} ${styles.field}`}>
                    <label>Title</label><input name='name' ref={nameInput} type="text" placeholder="Name" required />
                </p>
                <p className={`${styles.required} ${styles.field}`}>
                    <label>Date created*</label><input name='date_created' ref={dateCreatedInput} type="date" required />
                </p>
                <p className={`${styles.field}`}>
                    <label>Description</label><textarea name='description' ref={descriptionInput} placeholder="Description" />
                </p>

                <p className={`${styles.field}`}>
                    <label>Link Text</label><input name='linkText' ref={linkTextInput} type="text" placeholder="Link Text" />
                </p>
                <p className={`${styles.field}`}>
                    <label>Link URL (make sure you put the https://)</label><input name='linkUrl' ref={linkUrlInput} type="text" placeholder="Link URL" />
                </p>
                <TagsListCheckboxes handleCheckboxChangeMethod={checkboxHandler}></TagsListCheckboxes>

                <p className={`${styles.field}`}>
                    <label>New Tags</label><input id='new_tags' ref={newTagsInput} name='new_tags' type="text" placeholder="New Tags" />
                </p>
                <p className={`${styles.field}`}>
                    <label>Pinned: </label><input id='pinned' ref={pinnedInput} name='pinned' type="checkbox" placeholder="false" />
                </p>
                <p className={`${styles.field}`}>
                    <label>Dump: </label><input id='dump' ref={dumpInput} name='dump' type="checkbox" placeholder="false" />
                </p>

                {editMode ? <button className='cool-button-red margin-t-20px' onClick={handleDelete} type="button">Delete</button> : null}

                <button id="submit-button" className='cool-button centred' type="submit">Submit</button>
            </form>
        </div>
    )
}