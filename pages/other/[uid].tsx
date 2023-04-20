import { useEffect, useState } from "react";
import useSWR from 'swr';

import { getLogger } from "../../logging/log-util";
const logger = getLogger("edit-art")

import { useRouter } from 'next/router';
import { fetchProjectById } from "../../fetches/fetch_project_by_id";

import artStyles from '../../components/gallery/art_gallery.module.css';
import utilStyles from "../../styles/utils.module.css";

import Image from "next/image";
import Layout from "../../components/layout";
import { longDedupingInterval } from "../../fetches/swr_config";

import { ImageModal, disableBodyScroll, showModal } from "../../components/image_modal";
import { ProjectDataInterface, ProjectImageInterface } from "../../interfaces/firebase_interfaces";
import { ModalDisplayImage } from "../../interfaces/modals";
import Date from "../../components/date";




export default function ViewProject() {
    const router = useRouter()

    const [projectData, setProject] = useState<ProjectDataInterface | null>()
    let [clickedImage, setClickedImage] = useState<ModalDisplayImage>();

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
            let projectData = data as ProjectDataInterface
            logger.info("SUCCESS", projectData)
            setProject(projectData);
        }
    }, [data]);


    function handleClick({ title, description, url }: ProjectImageInterface) {
        let modalImage: ModalDisplayImage = {
            name: title,
            description: description,
            url: url
        }
        setClickedImage(modalImage);
        showModal()
        disableBodyScroll()
    }

    return (
        <div>
            <ImageModal clickedImage={clickedImage} updateMethod={setClickedImage} editAvailable={false}></ImageModal>

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
                            sizes="(max-width: 1200px) 50vw, 100vw"
                            placeholder="empty"
                        /> :
                        <Image
                            className={utilStyles.mainImage}
                            src="/images/placeholder.png"
                            alt="Placeholder"
                            fill={true}
                            sizes="(max-width: 1200px) 50vw, 100vw"
                            placeholder="empty"
                        />
                    }
                </div>
                <div className={utilStyles.containerWidth}>
                    <div className={utilStyles.paddingX15px}>
                        {projectData ?
                            <>
                                <p><b><Date dateString={projectData.date_created} /></b></p>
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
                            {projectData.project_images ? projectData.project_images.map(({ title, description, url }) => (
                                <div key={url} className={artStyles.artImageContainer}>
                                    <Image
                                        src={url}
                                        height={500}
                                        width={500}
                                        alt={title}
                                        onClick={() => {
                                            handleClick({ title, description, url })

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
