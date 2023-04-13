import Image from "next/image";
import modalStyles from '../styles/modal.module.css';
import { useState } from "react";


function Modal({ clickedImage, updateMethod }) {
    console.log(clickedImage)
    return (
        <div>
            <div id="image-modal" className={modalStyles.modal}>
                <span className={modalStyles.close} onClick={() => {
                    let modal = document.getElementById("image-modal");
                    modal.style.display = "none"
                    updateMethod({})
                }}>&times;</span>
                <img className={modalStyles.modalContent} src={clickedImage.url} id="modal-image" />
                <div id="caption">{clickedImage.caption}</div>
            </div>
        </div>
    )
}

function updateModal(description, url) {
    console.log(description)
    console.log(url)
    return { description, url }
}

export default function ArtGallery({ artData }) {
    console.log(artData)

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
                                        setClickedImage({ description, url });
                                        let modal = document.getElementById("image-modal");
                                        modal.style.display = "block";
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
                        <div className="placeholder"></div>
                        <div className="placeholder"></div>
                        <div className="placeholder"></div>
                    </div>
                </div>
            </section>
        )
    }



}