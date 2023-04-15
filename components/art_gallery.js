import Image from "next/image";
import modalStyles from '../styles/modal.module.css';
import searchStyles from '../styles/search.module.css'
import { useEffect, useState } from "react";
import { getLogger } from "../logging/log-util";
import Date from "./date"

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

function Modal({ clickedImage, updateMethod }) {

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
                </div>

            </div>
        </div>
    )
}




function FilterSearch({ artData, updateMethod, originalData }) {

    // Need to have a state for the originalData - as this can change when more is loaded.
    let [originalDataState, setOriginalDataState] = useState({});

    useEffect(() => {
        logger.debug("FilterSearch originalData is being updated.")
        setOriginalDataState(originalData);
    }, [originalData]);

    useEffect(() => {
        logger.debug("Filtering if available.. length of originalDataState", originalDataState.length)
        filterIfAvailable()
    }, [originalDataState])

    function filterIfAvailable() {
        // Check if there is a tagword. If there is, perform the filter
        let search = document.getElementById('filter-search');
        let tag_word = search.value.trim().toLowerCase();
        if (tag_word.length > 0) {
            let msg = document.getElementById('error-msg')
            msg.style.opacity = 0;
            filterClient(tag_word)
        }

    }

    function filterClient(tag_word) {
        let results = originalDataState.filter(obj => obj.tagsArray.includes(tag_word))


        if (results.length > 0) {
            updateMethod(results)
        } else {
            let msg = document.getElementById('error-msg')
            msg.style.opacity = 1;
        }
    }

    function clearFilters() {
        let search = document.getElementById('filter-search');
        search.value = "";

        let msg = document.getElementById('error-msg')
        msg.style.opacity = 0;
        updateMethod(originalDataState)
    }


    function handleInput() {
        let msg = document.getElementById('error-msg')
        msg.style.opacity = 0;
    }

    function handleKeyUp(e) {
        if (e.key === 'Enter') {
            filterIfAvailable()
        }
    }


    return (
        <div className={searchStyles.searchContainer}>

            <input id="filter-search" type="text" placeholder="Filter results by tag" name="search" onInput={handleInput} onKeyUp={handleKeyUp} />
            <button type="button" onClick={filterIfAvailable}><i className="fa fa-search"></i></button>
            <button type="button" onClick={clearFilters}><i className="fa fa-times"></i></button>
            <br />
            <small id="error-msg" className="errorMessage"><i>None of the results have that tag</i></small>
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
                <Modal clickedImage={clickedImage} updateMethod={setClickedImage}></Modal>
                <div className="wrapper">

                    {!hideFilter ? <FilterSearch artData={artData} updateMethod={galleryUpdateMethod} originalData={originalData}></FilterSearch> : null}

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