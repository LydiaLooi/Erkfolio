import { addDoc, collection, setDoc, doc, deleteDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, updateMetadata, uploadBytes } from 'firebase/storage';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { db, storage } from '../../scripts/firebase';

import { getLogger } from "../../logging/log-util";
import resizeImage from '../../scripts/image_resizing';

const logger = getLogger("dashboard");

import styles from "./form.module.css"
import Image from 'next/image';

import { activityCollection, projectCollection } from '../../collection_names';
import ImagePicker, { ImagePickerData } from './image_picker';
import ImageThumbnailGrid from './image_thumbnail_grid';

import { getCurrentUnixTimestamp, getTodaysDate } from '../../scripts/utils'
import { ProjectDataInterface, ProjectImageInterface, UploadRecentActivityInterface } from '../../interfaces/firebase_interfaces';
import { testResize } from './form_utils';
import newMetadata from '../../scripts/firebase_storage_metadata';


async function addRecentActivity(name: string, action: string) {
    logger.info("Attempting to addRecentActivity")

    let type = "project"

    let uploadActivity: UploadRecentActivityInterface = {
        action: action,
        type: type,
        title: name,
        collection: projectCollection,
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

interface ProjectSubmissionFormProps {
    editMode?: boolean,
    existingData?: ProjectDataInterface
}

interface UploadProjectInterface {
    id?: string,
    name: string,
    date_created: string,
    description: string,
    pinned: boolean,
    link: string,
    main_image_url?: string,
    mainImage?: Blob,
    project_images: Array<ProjectImageInterface>,
}

export default function ProjectSubmissionForm({ editMode = false, existingData }: ProjectSubmissionFormProps) {

    const mainImageInput = useRef<HTMLInputElement | null>(null)
    const nameInput = useRef<HTMLInputElement | null>(null)
    const dateCreatedInput = useRef<HTMLInputElement | null>(null)
    const descriptionInput = useRef<HTMLTextAreaElement | null>(null)
    const linkInput = useRef<HTMLInputElement | null>(null)
    const pinnedInput = useRef<HTMLInputElement | null>(null)

    const [projectImages, setProjectImages] = useState<Array<ImagePickerData>>([])

    const finalProjectImagesData = useRef<Array<ProjectImageInterface>>([]);


    useEffect(() => {
        if (editMode && existingData) { // Prefill fields with existing data
            nameInput.current!.value = existingData.name
            dateCreatedInput.current!.value = existingData.date_created
            descriptionInput.current!.value = existingData.description
            linkInput.current!.value = existingData.link
            pinnedInput.current!.checked = existingData.pinned
        }
    }, [existingData])


    async function uploadImageAndSave({ id, name, date_created, description, pinned, link, mainImage, project_images }: UploadProjectInterface) {

        if (!mainImage) {
            throw new Error("Attempting to upload and save with no mainImage")
        }

        const storageRef = ref(storage, `${projectCollection}/${mainImage.name}`) // Resize and save the mainImage... which hasn't been done yet.

        try {
            const data = await resizeImage({ imageFile: mainImage })
            logger.info("uploadImageAndSave Done!", data);
            if (data.blob && data.dataUrl) {
                const snapshot = await uploadBytes(storageRef, data.blob);
                logger.info("Obtained snapshot")
                const downloadUrl = await getDownloadURL(snapshot.ref);
                logger.info("Obtained downloadUrl")
                let results = await updateMetadata(storageRef, newMetadata)
                logger.info("Updated metadata", results)
                saveOrEditData({
                    id,
                    name,
                    description,
                    date_created,
                    pinned,
                    link,
                    main_image_url: downloadUrl,
                    project_images
                }, projectCollection)
            }
        } catch (error) {
            logger.error(error);
            let btn = document.getElementById("submit-button") as HTMLButtonElement;
            alert("Could not save...");
            btn.disabled = false;
        }
    }

    async function uploadImages() {
        logger.info("Uploading project images...")

        for (let projImage of projectImages) {
            let image = projImage
            let storageRef = ref(storage, `${projectCollection}/${image.title}-${getCurrentUnixTimestamp()}`)

            if (!image.resized) {
                throw new Error("Can't upload image with no blob")
            }

            let snapshot = await uploadBytes(storageRef, image.resized.blob)
            let downloadUrl = await getDownloadURL(snapshot.ref)
            let results = await updateMetadata(storageRef, newMetadata)
            logger.info("Updated metadata:", results)

            image.url = downloadUrl

            delete image.resized
            delete image.file

            finalProjectImagesData.current.push(image as ProjectImageInterface)
            logger.debug("Uploaded... ", downloadUrl)
        }
    }

    async function submitData(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await uploadImages()

        logger.info(finalProjectImagesData.current)

        let btn = document.getElementById("submit-button") as HTMLButtonElement;
        btn.disabled = true;

        const name = nameInput.current!.value;
        const date_created = dateCreatedInput.current!.value;
        const description = descriptionInput.current!.value;
        const link = linkInput.current!.value;
        const pinned = pinnedInput.current!.checked;

        let data: UploadProjectInterface = {
            name,
            date_created,
            description,
            link,
            pinned,
            project_images: finalProjectImagesData.current
        }

        if (editMode && existingData) {
            data.id = existingData.id
            data.main_image_url = existingData.main_image_url
        }


        let mainImage;
        mainImage = mainImageInput.current?.files![0];
        if (mainImage) {
            data.mainImage = mainImage
        }

        if (editMode) {
            logger.warn("Yeah uh, editing isn't a thing quite yet...")

        } else {
            await uploadImageAndSave(data)
        }

    }

    function removeUploadedImage() {
        mainImageInput.current!.value = "";
    }

    function handleTestResize() {
        testResize(mainImageInput.current?.files![0])
    }

    function handleDelete(e: MouseEvent<HTMLButtonElement>) {
        const button = e.currentTarget;
        button.disabled = true;

        let result = confirm("Are you sure you want to delete this?");
        if (result) {
            if (!existingData) {
                throw new Error("Attempting to delete when no existing data has been passed in")
            }
            deleteData(existingData.id)
        } else {
            e.currentTarget.disabled = false;
        }
    }


    /**
     * Will either save or edit the data. Will edit the data if artData has an id
     * @param {*} data 
     */
    const saveOrEditData = async (data: UploadProjectInterface, collectionName: string) => {
        logger.debug(data)
        delete data.mainImage

        try {
            if (data.id) {
                logger.info("We're gonna set a doc instead of add one since we have...", data.id)
                const docRef = doc(db, collectionName, data.id);
                delete data.id

                logger.debug("Final data..", data)
                await setDoc(docRef, data)
                logger.info("Successfully edited... Reloading...")

            } else {
                delete data.id

                await addDoc(collection(db, collectionName), data)
                logger.info("Successfully added to project collection... Either need to refresh or wait for update.")
                await addRecentActivity(data.name, "upload")
            }
            window.location.reload();

        } catch (error) {
            logger.error(error)
            alert('Failed to add the data')
        }
    }

    const deleteData = async (id: string) => {
        logger.debug("DELETE", id)
        try {
            const docRef = doc(db, projectCollection, id);
            await deleteDoc(docRef)
            logger.info("Successfully deleted... Going back to dashboard...")
            window.location.reload();

        } catch (error) {
            logger.error(error)
            alert('Failed to delete the data')
        }
    }

    async function handleImagePicked(imageData: ImagePickerData) {
        logger.debug("AN IMAGE HAS BEEN PICKED??? current", projectImages)

        if (!imageData.file) {
            throw new Error("Image picked has no file associated")
        }

        // Do some resizing, on resizedone, set project images..
        let data = await resizeImage({
            imageFile: imageData.file,
        })

        imageData.resized = data
        setProjectImages(projectImages.concat([imageData] as never))
    }


    return (
        <div>
            <form className={styles.form} onSubmit={submitData}>

                {
                    editMode && existingData ? <Image src={existingData.main_image_url} width={100} height={100} alt={existingData.name} /> : null
                }

                {
                    !editMode ?
                        <p className={`${styles.required} ${styles.field}`}>
                            <label>Main Image</label><input name='mainImage' ref={mainImageInput} type="file" placeholder="Image" required />
                        </p>
                        :
                        <p className={`${styles} ${styles.field}`}>
                            <label>Main Image </label>
                            <small><i>Note: This will overwrite the current image above.</i></small>
                            <br />
                            <input name='mainImage' ref={mainImageInput} type="file" placeholder="Image" />
                        </p>
                }

                {
                    editMode ? <button className='cool-button-red centred' type="button" onClick={removeUploadedImage}>Remove image</button> : null
                }


                <div id="resized-image"></div>
                <button className='cool-button centred' type="button" onClick={handleTestResize}>Test Resize</button>


                <p className={`${styles.required} ${styles.field}`}>
                    <label>Project Name</label><input name='name' ref={nameInput} type="text" placeholder="Name" required />
                </p>
                <p className={`${styles.required} ${styles.field}`}>
                    <label>Date created*</label><input name='date_created' ref={dateCreatedInput} type="date" required />
                </p>
                <p className={`${styles.field}`}>
                    <label>Project Description</label><textarea name='description' ref={descriptionInput} placeholder="Description" />
                </p>
                <p className={`${styles.field}`}>
                    <label>Project Link</label><input name='link' ref={linkInput} type="text" placeholder="URL" />
                </p>

                <p className={`${styles.field}`}>
                    <label>Pinned: </label><input id='pinned' ref={pinnedInput} name='pinned' type="checkbox" placeholder="false" />
                </p>


                <h3 className={`${styles.field}`}>Project Images</h3>


                <div className={styles.field}>
                    <ImageThumbnailGrid images={projectImages} />
                </div>

                <div className={`${styles.field}`}>
                    <ImagePicker handleData={handleImagePicked}></ImagePicker>
                </div>


                {editMode ? <button className='cool-button-red margin-t-20px' onClick={handleDelete} type="button">Delete</button> : null}

                <button id="submit-button" className='cool-button centred' type="submit">Submit</button>


            </form>
        </div>
    )
}