import Image from "next/image";
import { useState } from "react";
import { getLogger } from "../../logging/log-util";
import Date from "../date";
import artStyles from './art_gallery.module.css';
import { ImageModal, showModal, disableBodyScroll } from "../image_modal"
import FilterSearch from "./art_filter_search";


const logger = getLogger("gallery");

export default function ArtGallery({ artData, galleryUpdateMethod, originalData, hideFilter = false }) {
    logger.debug("ArtGallery artData", artData)
    logger.debug("ArtGallery galleryUpdateMethod", galleryUpdateMethod)
    logger.debug("ArtGallery originalData", originalData)

    let [clickedImage, setClickedImage] = useState({});

    if (artData && artData.length != 0) {
        return (
            <section>
                <ImageModal clickedImage={clickedImage} updateMethod={setClickedImage}></ImageModal>
                <div className="wrapper">

                    {!hideFilter ? <FilterSearch artData={artData} updateMethod={galleryUpdateMethod} originalData={originalData}></FilterSearch> : null}

                    <div className="gallery">

                        {artData.map(({ id, name, description, date_created, pinned, tagsArray, url }) => (
                            <div key={id} className={artStyles.artImageContainer}>
                                <Image
                                    src={url}
                                    height={500}
                                    width={500}
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

                            </div>
                        ))}

                    </div>
                </div>
            </section>
        )
    } else {
        return (
            <section>
                <div className="wrapper">
                    <div className="gallery">
                        <div className="placeholder"></div>
                        <div className="placeholder"></div>
                        <div className="placeholder"></div>
                    </div>
                </div>
            </section>
        )
    }
}