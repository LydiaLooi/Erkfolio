import Image from "next/image";
import artStyles from './art_gallery.module.css';
import modalStyles from '../../styles/modal.module.css';
import { useEffect, useState } from "react";
import { getLogger } from "../../logging/log-util";
import Date from "../date"
import { onAuthStateChanged } from "@firebase/auth";
import { isAdminUUID } from "../../scripts/utils";
import { auth } from "../../scripts/firebase";
import Link from "next/link";

import FilterSearch from "./art_filter_search"


const logger = getLogger("gallery");

function disableBodyScroll() {
    let body = document.getElementsByTagName("body")[0];
    body.style.height = "100vh";
    body.style.overflowY = "hidden";
}

function enableBodyScroll() {
    let body = document.getElementsByTagName("body")[0];
    body.style.height = "100vh";
    body.style.overflowY = "auto";
}

function showModal() {
    let modal = document.getElementById("image-modal");
    modal.style.display = "block";
}

function hideModal() {
    let modal = document.getElementById("image-modal");
    modal.style.display = "none"
}

function closeModal(updateMethod) {
    hideModal()
    enableBodyScroll()
    updateMethod({ name: "placeholder" })
}

function ImageModal({ clickedImage, updateMethod }) {

    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    let tags = "";
    if (clickedImage.tagsArray) {
        tags = clickedImage.tagsArray.sort().join(", ")
    }

    let url = clickedImage.url
    let alt = clickedImage.name

    if (!url || url.length == 0) {
        url = "/images/placeholder.png"
        alt = "placeholder"
    }

    return (
        <div>

            <div id="image-modal" className={modalStyles.modal} onClick={() => {
                closeModal(updateMethod)
            }}>
                <div className={modalStyles.closeDiv} onClick={(e) => {
                    closeModal(updateMethod)
                }}>
                    <span className={modalStyles.close} >
                        &times;
                    </span>
                    <span className={modalStyles.closeText}>Close</span>
                </div>


                <div className={modalStyles.modalContainer} onClick={(e) => {
                    e.stopPropagation();
                }}>


                    <div className={modalStyles.imageContainer}>
                        <Image
                            className={modalStyles.modalImage}
                            src={url}
                            id="modal-image"
                            fill={true}
                            alt={alt}
                            sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            100vw"
                        />
                    </div>
                    <div className={modalStyles.modalCaption}>
                        <h3>{clickedImage.name}</h3>
                        <Date dateString={clickedImage.date_created}></Date>
                        <p>{clickedImage.description}</p>

                        {tags.length > 0 ? <p><small>Tags: <i>{tags}</i></small></p> : null}

                    </div>
                    {
                        user && isAdminUUID(user.uid) ?
                            <div>
                                <Link className="cool-button centred" href={`/dashboard/edit/${clickedImage.id}`}>Edit</Link>

                            </div>
                            :
                            null
                    }
                </div>

            </div>
        </div>
    )
}




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