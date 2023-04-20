import { useEffect, useState } from "react";
import useSWR from 'swr'

import { getLogger } from "../../logging/log-util";
const logger = getLogger("edit-art")

import { useRouter } from 'next/router'
import { fetchProjectById } from "../../fetches/fetch_project_by_id";

import utilStyles from "../../styles/utils.module.css"
import artStyles from '../../components/art_gallery.module.css';
import modalStyles from "../../styles/modal.module.css"

import Layout from "../../components/layout";
import { longDedupingInterval } from "../../fetches/swr_config";
import Image from "next/image";


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
                        <h3>{clickedImage.title}</h3>
                        <p>{clickedImage.description}</p>

                        {tags.length > 0 ? <p><small>Tags: <i>{tags}</i></small></p> : null}

                    </div>

                </div>

            </div>
        </div>
    )
}





export default function ViewProject() {
    const router = useRouter()

    const [projectData, setProject] = useState()
    let [clickedImage, setClickedImage] = useState({});

    const { uid } = router.query

    logger.debug("Fetching:", uid)

    const { data, error } = useSWR(
        uid,
        fetchProjectById,
        {
            dedupingInterval: longDedupingInterval,
            onSuccess: () => {
                logger.info("Retrieved???")
            },
        }
    );

    if (error) {
        logger.error("An error occured while fetching data... redirecting to the dashboard")
        router.push('/dashboard', undefined, { shallow: true })
    }
    if (!data) {
        logger.info("Loading data...")
    }

    useEffect(() => {
        if (data) {
            logger.info("SUCCESS", data)
            setProject(data);
        }
    }, [data]);


    return (
        <div>
            <Modal clickedImage={clickedImage} updateMethod={setClickedImage}></Modal>

            <Layout>
                <div>
                    {projectData ?
                        <h2 className={utilStyles.underline}>{projectData.name}</h2>
                        :
                        <h2 className={utilStyles.underline}>Loading...</h2>
                    }
                </div>
            </Layout>
            <div className="wrapper">
                <div className={utilStyles.mainImageContainer}>
                    {projectData ?
                        <Image
                            className={utilStyles.mainImage}
                            src={projectData.main_image_url}
                            alt={projectData.name}
                            fill={true}
                            placeholder="empty"
                        /> :
                        <Image
                            className={utilStyles.mainImage}
                            src="/images/placeholder.png"
                            alt="Placeholder"
                            fill={true}
                            placeholder="empty"
                        />
                    }
                </div>
                <div className={utilStyles.containerWidth}>
                    <div className={utilStyles.paddingX15px}>
                        {projectData ?
                            <>
                                <p>{projectData.description}</p>
                                {projectData.link ? <i> <a href={projectData.link}>{projectData.link}</a></i> : null}
                            </>
                            : <p>Loading...</p>}
                    </div>
                </div>
            </div>



            {
                projectData && projectData.project_images ?
                    <div className="wrapper">
                        <h3 className={utilStyles.underline}>Project Images</h3>
                        <div className="gallery">
                            {logger.debug("Project images??", projectData.project_images)}
                            {projectData.project_images ? projectData.project_images.map(({ title, description, url }) => (
                                <div key={url} className={artStyles.artImageContainer}>
                                    <Image
                                        src={url}
                                        height={500}
                                        width={500}
                                        alt={title}
                                        onClick={() => {
                                            setClickedImage({ title, description, url });
                                            showModal()
                                            disableBodyScroll()
                                        }}
                                    />
                                    <div className={artStyles.imageOverlay}>
                                        <span>{title}</span><br />
                                        <small>{description}</small>
                                    </div>

                                </div>
                            )) : <p>None :(</p>}
                        </div>
                    </div>


                    : null
            }
        </div >
    );
}
