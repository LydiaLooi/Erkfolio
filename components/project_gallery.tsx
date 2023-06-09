import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from 'swr';
import { fetchAllProjectsByRecent } from "../fetches/fetch_all_projects";
import { longDedupingInterval } from "../fetches/swr_config";
import { getLogger } from "../logging/log-util";
import artStyles from './gallery/art_gallery.module.css';
import Date from "./date";
import { ProjectDataInterface } from "../interfaces/firebase_interfaces";
import { motion } from "framer-motion"

const logger = getLogger("project-gallery");

interface ProjectGalleryInterface {
    projectData: Array<ProjectDataInterface>,
    projectDataUpdateMethod: (arg: Array<ProjectDataInterface>) => void
}

export default function ProjectGallery({ projectData, projectDataUpdateMethod }: ProjectGalleryInterface) {
    const router = useRouter()

    logger.debug("ProjectGallery artData", projectData)
    logger.debug("ProjectGallery galleryUpdateMethod", projectDataUpdateMethod)


    const { data, error } = useSWR(
        [`fetchAllProjectsByRecent`],
        fetchAllProjectsByRecent,
        {
            dedupingInterval: longDedupingInterval,
        }
    );

    if (error) {
        logger.error("An error occured")
        logger.error(error)
    }
    if (!data) {
        logger.info("Loading data...")
    }

    useEffect(() => {
        if (data) {
            logger.info("DATA", data)
            projectDataUpdateMethod(data)
        }
    }, [data])


    if (projectData && projectData.length != 0) {
        return (
            <section>
                <div className="wrapper">


                    <div className="gallery">

                        {projectData.map(({ id, name, description, date_created, main_image_url }, index) => (
                            <motion.div key={id} className={artStyles.artImageContainer}

                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                exit={{ y: 200, opacity: 0 }}
                                layout

                            >
                                <Image
                                    src={main_image_url}
                                    height={500}
                                    loading={index < 3 ? "eager" : "lazy"} // Eager load the first three images, then lazily load the rest.
                                    width={500}
                                    alt={name}
                                    onClick={() => {
                                        router.push(`/other/${id}`, undefined, { shallow: true })
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