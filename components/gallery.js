import Image from "next/image";
import modalStyles from '../styles/modal.module.css';
import { useState } from "react";
import { getLogger } from "../logging/log-util";
import Date from "../components/date"

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
    updateMethod({})
}

function Modal({ clickedImage, updateMethod }) {
    logger.debug(clickedImage)

    document.body.addEventListener('keyup', function (e) {
        if (e.key == "Escape") {
            closeModal(updateMethod)
        }
    });

    let tags = "";
    if (clickedImage.tagsArray) {
        tags = clickedImage.tagsArray.sort().join(", ")
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



                    <img className={modalStyles.modalImage} src={clickedImage.url} id="modal-image" />
                    <div className={modalStyles.modalCaption}>
                        <h3>{clickedImage.name}</h3>
                        <Date dateString={clickedImage.date_created}></Date>
                        <p>{clickedImage.description}</p>

                        <p><small>Tags: <i>{tags}</i></small></p>

                    </div>
                </div>

            </div>
        </div>
    )
}


export default function ArtGallery({ artData }) {
    logger.debug(artData)

    let [clickedImage, setClickedImage] = useState({});


    if (artData.length != 0) {
        return (
            <section>
                <Modal clickedImage={clickedImage} updateMethod={setClickedImage}></Modal>
                <div className="wrapper">
                    <div className="gallery">

                        {artData.map(({ name, description, date_created, pinned, tagsArray, url }) => (
                            <div key={url}>
                                <Image

                                    src={url}
                                    height={500}
                                    width={500}
                                    alt={name}
                                    onClick={() => {
                                        setClickedImage({ description, url, name, date_created, tagsArray });
                                        showModal()
                                        disableBodyScroll()

                                    }}
                                />
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