import { onAuthStateChanged } from "@firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../scripts/firebase";
import { isAdminUUID } from "../scripts/utils";
import modalStyles from '../styles/modal.module.css';
import Date from "./date";


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
    modal.style.display = "block";
}

export function hideModal() {
    let modal = document.getElementById("image-modal");
    modal.style.display = "none"
}

export function closeModal(updateMethod) {
    hideModal()
    enableBodyScroll()
    updateMethod({ name: "placeholder" })
}

export function ImageModal({ clickedImage, updateMethod }) {

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

