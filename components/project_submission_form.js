import { addDoc, collection, setDoc, doc, deleteDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { db, storage } from '../scripts/firebase';

import { getLogger } from "../logging/log-util";
import resizeImage from '../scripts/image_resizing';

const logger = getLogger("dashboard");

import styles from "./form.module.css"
import Image from 'next/image';

import { projectCollection } from '../collection_names';
import ImagePicker from './image_picker';



export default function ProjectSubmissionForm({ editMode = false, existingData }) {

    const form = useRef();
    const mainImageInput = useRef()
    const nameInput = useRef()
    const dateCreatedInput = useRef()
    const descriptionInput = useRef()
    const linkInput = useRef()
    const pinnedInput = useRef();

    const [projectImages, setProjectImages] = useState()

    const resizeEvent = "imageResized"


    useEffect(() => {
        if (editMode && existingData) { // Prefill fields with existing data
            nameInput.current.value = existingData.name
            dateCreatedInput.current.value = existingData.date_created
            descriptionInput.current.value = existingData.description
            linkInput.current.value = existingData.link
            pinnedInput.current.checked = existingData.pinned
        }
    }, [existingData])


    function uploadImageAndSave({ id, name, date_created, description, pinned, link, mainImage }) {
        const storageRef = ref(storage, `${projectCollection}/${mainImage.name}`)

        $(document).on(resizeEvent, function (event) {
            logger.info("Image successfully resized")
            if (event.blob && event.url) {
                uploadBytes(storageRef, event.blob).then(
                    (snapshot) => {
                        getDownloadURL(snapshot.ref).then((downloadUrl) => {
                            saveOrEditData({
                                id,
                                name,
                                description,
                                date_created,
                                pinned,
                                link,
                                main_image_url: downloadUrl
                            }, projectCollection)
                        }, (error) => {
                            logger.error(error)
                            alert("Could not save...")
                            btn.disabled = false;


                        })
                    }, (error) => {
                        logger.error(error)
                        alert("Could not save...")
                        btn.disabled = false;
                    }
                )
            }
        });

        resizeImage({ imageFile: mainImage, eventName: resizeEvent })
    }

    const submitArt = (e) => {
        e.preventDefault();

        let btn = document.getElementById("submit-button");
        btn.disabled = true;

        const name = nameInput.current?.value;
        const date_created = dateCreatedInput.current?.value;
        const description = descriptionInput.current?.value;
        const link = linkInput.current?.value;
        const pinned = pinnedInput.current?.checked;

        let data = {
            name,
            date_created,
            description,
            link,
            pinned
        }

        if (editMode && existingData) {
            data.id = existingData.id
            data.main_image_url = existingData.main_image_url
        }


        let mainImage;
        mainImage = mainImageInput.current?.files[0];
        if (mainImage) {
            data.mainImage = mainImage
        }

        if (editMode) {

            if (!mainImage) {
                logger.warn("No image found ... so we're not editing the image")
                saveOrEditData(data, projectCollection) // Go straight into editing the data...
            } else {
                // Do the thing
                uploadImageAndSave(data)
            }
        } else {
            uploadImageAndSave(data)
        }

    }

    function removeUploadedImage() {
        mainImageInput.current.value = "";
    }

    function testResize() {
        let mainImage;
        mainImage = mainImageInput.current?.files[0];


        if (!mainImage) {
            logger.warn("No image has been selected yet")
            return
        }

        $(document).on("testResize", function (event) {
            // Check if the <div> element already contains an <img> element
            let resizedImageDiv = document.getElementById('resized-image');
            if (resizedImageDiv.getElementsByTagName('img').length === 0) {
                // Create a new <img> element and set its src attribute to the data URL of the resized image
                let img = document.createElement('img');
                img.src = event.url;

                // Append the <img> element to the <div> element with the id "resized-image"
                resizedImageDiv.appendChild(img);
            }
        });

        let div = document.getElementById("resized-image");

        // Select all <img> elements within the <div>
        let images = div.querySelectorAll('img');

        // Loop through each <img> element and remove it from the <div>
        images.forEach(function (image) {
            image.remove();
        });

        resizeImage({ imageFile: mainImage, eventName: "testResize" })
    }


    function handleDelete(e) {
        e.target.disabled = true;

        let result = confirm("Are you sure you want to delete this?");
        if (result) {
            deleteData(existingData.id)
        } else {
            e.target.disabled = false;
        }
    }


    /**
     * Will either save or edit the data. Will edit the data if artData has an id
     * @param {*} data 
     */
    const saveOrEditData = async (data, collectionName) => {
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
            }
            window.location.reload();

        } catch (error) {
            logger.error(error)
            alert('Failed to add the data')
        }
    }

    const deleteData = async (id) => {
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

    function handleImagePicked(image) {
        logger.debug("AN IMAGE HAS BEEN PICKED???", image)
    }


    return (
        <div>
            <form className={styles.form} ref={form} onSubmit={submitArt}>

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
                <button className='cool-button centred' type="button" onClick={testResize}>Test Resize</button>


                <p className={`${styles.required} ${styles.field}`}>
                    <label>Project Name</label><input name='name' ref={nameInput} type="text" placeholder="Name" required />
                </p>
                <p className={`${styles.required} ${styles.field}`}>
                    <label>Date created*</label><input name='date_created' ref={dateCreatedInput} type="date" required />
                </p>
                <p className={`${styles.field}`}>
                    <label>Project Description</label><textarea name='description' ref={descriptionInput} type="text" placeholder="Description" />
                </p>
                <p className={`${styles.field}`}>
                    <label>Project Link</label><input name='link' ref={linkInput} type="text" placeholder="URL" />
                </p>


                <h3 className={`${styles.field}`}>Project Images</h3>
                <ImagePicker handleData={handleImagePicked}></ImagePicker>


                <p className={`${styles.field}`}>
                    <label>Pinned: </label><input id='pinned' ref={pinnedInput} name='pinned' type="checkbox" placeholder="false" />
                </p>

                {editMode ? <button className='cool-button-red margin-t-20px' onClick={handleDelete} type="button">Delete</button> : null}

                <button id="submit-button" className='cool-button centred' type="submit">Submit</button>


            </form>
        </div>
    )
}