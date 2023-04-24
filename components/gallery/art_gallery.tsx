import { motion } from 'framer-motion';
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ArtInterface, TagDataInterface } from "../../interfaces/firebase_interfaces";
import { ModalDisplayImage } from "../../interfaces/modals";
import { getLogger } from "../../logging/log-util";
import searchStyles from '../../styles/search.module.css';
import Date from "../date";
import TagsListCheckboxes from "../forms/tags_list_checkboxes";
import { ImageModal, disableBodyScroll, showModal } from "../image_modal";
import artStyles from './art_gallery.module.css';


const logger = getLogger("gallery");

interface ArtGalleryProps {
    artData: Array<ArtInterface>,
    galleryUpdateMethod?: (arg: Array<ArtInterface>) => void,
    originalData: Array<ArtInterface>,
    hideFilter: boolean
}



export default function ArtGallery({ artData, galleryUpdateMethod, originalData, hideFilter = false }: ArtGalleryProps) {
    logger.debug("ArtGallery artData", artData)
    logger.debug("ArtGallery galleryUpdateMethod", galleryUpdateMethod)
    logger.debug("ArtGallery originalData", originalData)

    let [clickedImage, setClickedImage] = useState<ModalDisplayImage>();
    let [existingTags, setExistingTags] = useState<Array<TagDataInterface>>([]);

    let checkedTags = useRef<Array<string>>([]);

    function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
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
        filterClient()
    }

    useEffect(() => {
        let tagsSet: Set<string> = new Set();
        let finalArray: Array<TagDataInterface> = [];
        logger.info("OriginalData:", originalData)
        for (const data of originalData) {

            for (const tagName of data.tagsArray) {
                if (!tagsSet.has(tagName)) {
                    tagsSet.add(tagName);
                    finalArray.push({ id: finalArray.length.toString(), name: tagName });
                }
            }
        }
        logger.info("Finalarray", finalArray)
        setExistingTags(finalArray)
        filterIfAvailable()
    }, [originalData])



    function getErrorMessageElement() {
        let msg = document.getElementById('filter-error-msg')
        if (!msg) {
            throw new Error("Element filter-error-msg could not be found")
        }
        return msg

    }

    function filterClient() {

        const msg = getErrorMessageElement()
        if (!originalData) {
            throw new Error("Art results haven't loaded yet.")
        } else if (!galleryUpdateMethod) {
            throw new Error("Cannot filter without providing galleryUpdateMethod")
        }

        if (checkedTags.current.length == 0) {
            galleryUpdateMethod(originalData)
            msg.style.opacity = "0";
            return
        }

        let results = originalData.filter(obj => {
            return checkedTags.current.some(tag => obj.tagsArray.includes(tag));
        });

        if (results.length > 0) {
            galleryUpdateMethod(results)
            msg.style.opacity = "0";
        } else {

            msg.style.opacity = "1";
        }
    }

    function clearFilters() {
        logger.warn("Checkboxes don't uncheck themselves")
        if (!galleryUpdateMethod) {
            throw new Error("Cannot filter without providing galleryUpdateMethod")
        }
        if (originalData) {
            galleryUpdateMethod(originalData)
            checkedTags.current = []
        } else {
            logger.warn("Art results hasn't loaded yet")
        }
    }


    function filterIfAvailable() {
        // Check if there is a tagword. If there is, perform the filter
        if (checkedTags.current.length > 0) {
            let msg = getErrorMessageElement()
            msg.style.opacity = "0";
            filterClient()
        }
    }


    return (
        <section>
            <ImageModal clickedImage={clickedImage} updateMethod={setClickedImage} />

            <div className="wrapper">

                {artData && artData.length > 0 ?
                    <div>

                        {!hideFilter ?
                            <div className={searchStyles.searchContainer}>
                                <small><i>Tags you can filter by:</i></small>
                                <TagsListCheckboxes handleCheckboxChangeMethod={handleCheckboxChange} existingTags={existingTags} />
                                <i id="filter-error-msg" className="errorMessage">No results</i>
                            </div>
                            : null}

                        <div className="gallery">

                            {artData.map(({ id, name, description, date_created, pinned, tagsArray, url }, index) => (
                                <motion.div className={artStyles.artImageContainer} key={id}
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    exit={{ y: 200, opacity: 0 }}
                                    layout
                                >
                                    <Image
                                        src={url}
                                        height={500}
                                        width={500}
                                        loading={index < 3 ? "eager" : "lazy"} // Eager load the first three images, then lazily load the rest.
                                        priority={index == 0 ? true : false}
                                        sizes="(max-width: 700px) 100vw,
                                    500px"
                                        alt={name}
                                        onClick={() => {
                                            setClickedImage({ id, description, url, name, date_created, tagsArray });
                                            showModal()
                                            disableBodyScroll()
                                        }}
                                    />
                                    <div className={artStyles.imageOverlay}>
                                        <span>{name}</span><br />
                                        <small><Date dateString={date_created} /></small>
                                    </div>

                                </motion.div>
                            ))}

                        </div>
                    </div>
                    :
                    <div className="gallery">
                        <div className="placeholder"></div>
                        <div className="placeholder"></div>
                        <div className="placeholder"></div>
                    </div>
                }
            </div>
        </section >
    )
}