import { onAuthStateChanged, User } from "@firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../scripts/firebase";
import { isAdminUUID } from "../scripts/utils";
import modalStyles from '../styles/modal.module.css';
import Date from "./date";

import { motion } from "framer-motion"

import { getLogger } from "../logging/log-util";
import { ModalDisplayImage } from "../interfaces/modals";

const logger = getLogger("image-modal")

export function disableBodyScroll() {
    let body = document.getElementsByTagName("body")[0];
    body.style.height = "100vh";
    body.style.overflowY = "hidden";
}

export function enableBodyScroll() {
    let body = document.getElementsByTagName("body")[0];
    body.style.height = "100vh";
    body.style.overflowY = "auto";
}

export function showModal() {
    let modal = document.getElementById("image-modal");
    if (modal) {
        modal.style.display = "block";
    } else {
        logger.warn("image-modal element couldn't be found")
    }
}

export function hideModal() {
    let modal = document.getElementById("image-modal");
    if (modal) {
        modal.style.display = "none"
    } else {
        logger.warn("image-modal element couldn't be found")
    }
}

export function closeModal(updateMethod: (arg: ModalDisplayImage) => void) {
    hideModal()
    enableBodyScroll()
    updateMethod({ name: "placeholder" })
}


interface ImageModalProps {
    clickedImage?: ModalDisplayImage,
    updateMethod: (arg: ModalDisplayImage) => void
    editAvailable?: boolean
}

export function ImageModal({ clickedImage, updateMethod, editAvailable = true }: ImageModalProps) {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(undefined);
            }
        });
    }, []);

    let tags = "";
    if (!clickedImage) {
        return (
            <>
                <div>
                    <div id="image-modal" className={modalStyles.modal} onClick={() => {
                        closeModal(updateMethod)
                    }}></div>
                </div>
            </>
        )
    }
    if (clickedImage.tagsArray) {
        const sortedTags = clickedImage.tagsArray.sort()
        tags = sortedTags.join(", ")
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


                    <motion.div key={url} className={modalStyles.imageContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >

                        {alt != "placeholder" ?

                            <Image
                                className={modalStyles.modalImage}
                                src={url}
                                id="modal-image"
                                fill={true}
                                alt={alt}
                                sizes={alt != "placeholder" ? "(max-width: 1200px) 50vw, 100vw" : "10px"}
                                quality={alt != "placeholder" ? 100 : 1}
                            />

                            : <div className={modalStyles.placeholderDiv} />}

                    </motion.div>
                    <div className={modalStyles.modalCaption}>
                        <h3>{clickedImage.name}</h3>
                        <Date dateString={clickedImage.date_created}></Date>
                        <p>{clickedImage.description}</p>

                        {tags.length > 0 ? <p><small>Tags: <i>{tags}</i></small></p> : null}

                    </div>
                    {
                        user && isAdminUUID(user.uid) && editAvailable ?
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

