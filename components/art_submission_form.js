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


export default function ArtSubmissionForm() {
    const form = useRef();

    const checkedTags = useRef([]);

    const submitArt = (e) => {
        e.preventDefault();
        const name = form.current[0]?.value;
        const description = form.current[1]?.value;
        const tags = form.current[2]?.value;
        const date_created = form.current[3]?.value;
        const pinned = form.current[4]?.checked;
        const image = form.current[5]?.files[0];

        logger.debug(image)

        let tagsArray = [];

        tagsArray = tags.split(",").map(tag => tag.trim());

        const storageRef = ref(storage, `${artCollection}/${image.name}`)

        $(document).on("imageResized", function (event) {
            logger.info("Image successfully resized")
            if (event.blob && event.url) {
                uploadBytes(storageRef, event.blob).then(
                    (snapshot) => {
                        getDownloadURL(snapshot.ref).then((downloadUrl) => {
                            saveData({ name, description, tagsArray, date_created, pinned, url: downloadUrl })
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
            logger.info("Successfully added to collection.")
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
                    <label>Date created*: </label><input name='date_created' type="date" required />
                </p>
                <p className={`${styles.field}`}>
                    <label>Description: </label><textarea name='description' type="text" placeholder="Description" />
                </p>
                {/* <label>Tags: </label><input name='tags' type="text" placeholder="Tags" /> */}

                <TagsListCheckboxes handleCheckboxChangeMethod={checkboxHandler}></TagsListCheckboxes>

                <p className={`${styles.field}`}>
                    <label>New Tags </label><input name='new_tags' type="text" placeholder="New Tags" />
                </p>
                <p className={`${styles.field}`}>
                    <label>Pinned: </label><input name='pinned' type="checkbox" placeholder="false" />
                </p>
                <button className='cool-button centred' type="submit">Submit</button><br />
            </form>
        </div>
    )
}