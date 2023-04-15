import { addDoc, collection } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRef } from 'react';
import { db, storage } from '../scripts/firebase';

import { getLogger } from "../logging/log-util";
import resizeImage from '../scripts/image_resizing';
import TagsListCheckboxes from './tags_list_checkboxes';

const logger = getLogger("dashboard");
const artCollection = "art";

import styles from "./form.module.css"

const saveNewTag = async (tagData) => {
    logger.debug("tagData", tagData)
    try {
        await addDoc(collection(db, 'filters'), tagData)
        logger.info("Successfully added ", tagData.name)
    } catch (error) {
        logger.error(error)
        alert('failed to add new tag')
    }
}

/**
 * Processes the new tags and adds it to the existing array if it isn't already there.
 * @param {*} newTagsArray 
 * @param {*} tagsArray 
 */
function addTags(newTagsArray, tagsArray) {
    for (const tag of newTagsArray) {
        if (!tagsArray.includes(tag) && tag.length > 0) {
            tagsArray.push(tag);
            saveNewTag({ name: tag })
            logger.debug("Adding tag:", tag)
        }
    }


}

export default function ArtSubmissionForm() {
    const form = useRef();
    const newTagsInput = useRef();
    const pinnedInput = useRef();
    const dumpInput = useRef();
    const checkedTags = useRef([]);

    const submitArt = (e) => {
        logger.debug("Checked tags:", checkedTags.current)
        e.preventDefault();
        const image = form.current[0]?.files[0];
        const name = form.current[1]?.value;
        const date_created = form.current[2]?.value;
        const description = form.current[3]?.value;
        const newTags = newTagsInput.current?.value;
        const pinned = pinnedInput.current?.checked;
        const dump = dumpInput.current?.checked;

        logger.debug("Image", image)

        let newTagsArray = newTags.split(",").map(tag => tag.trim());

        addTags(newTagsArray, checkedTags.current);


        const storageRef = ref(storage, `${artCollection}/${image.name}`)

        $(document).on("imageResized", function (event) {
            logger.info("Image successfully resized")
            if (event.blob && event.url) {
                uploadBytes(storageRef, event.blob).then(
                    (snapshot) => {
                        getDownloadURL(snapshot.ref).then((downloadUrl) => {
                            saveData({ name, description, tagsArray: checkedTags.current, date_created, pinned, dump, url: downloadUrl })
                        }, (error) => {
                            logger.error(error)
                            alert("Could not save...")

                        })
                    }, (error) => {
                        logger.error(error)
                        alert("Could not save...")

                    }
                )
            }
        });

        resizeImage(image)

    }



    const saveData = async (artData) => {
        logger.debug(artData)
        try {
            await addDoc(collection(db, artCollection), artData)
            logger.info("Successfully added to art collection.")
            window.location.reload(false); // reload if successful
        } catch (error) {
            logger.error(error)
            alert('Failed to add the data')
        }
    }

    function checkboxHandler(e) {
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
            <form className={styles.form} ref={form} onSubmit={submitArt}>
                <p className={`${styles.required} ${styles.field}`}>
                    <label>Image</label><input name='image' type="file" placeholder="Image" required />
                </p>

                <p className={`${styles.required} ${styles.field}`}>
                    <label>Title</label><input name='name' type="text" placeholder="Name" required />
                </p>
                <p className={`${styles.required} ${styles.field}`}>
                    <label>Date created*</label><input name='date_created' type="date" required />
                </p>
                <p className={`${styles.field}`}>
                    <label>Description</label><textarea name='description' type="text" placeholder="Description" />
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
                <button className='cool-button centred' type="submit">Submit</button><br />
            </form>
        </div>
    )
}