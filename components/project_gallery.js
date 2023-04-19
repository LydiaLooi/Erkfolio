import Image from "next/image";
import artStyles from './art_gallery.module.css';
import modalStyles from '../styles/modal.module.css';
import searchStyles from '../styles/search.module.css'
import { useEffect, useState } from "react";
import { getLogger } from "../logging/log-util";
import Date from "./date"
import { onAuthStateChanged } from "@firebase/auth";
import { isAdminUUID } from "../scripts/utils";
import { auth } from "../scripts/firebase";
import Link from "next/link";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSWR from 'swr'
import { fetchAllProjectsByRecent } from "../fetches/fetch_all_projects";
import { longDedupingInterval } from "../fetches/swr_config";
import { useRouter } from "next/router";

const logger = getLogger("project-gallery");


export default function ProjectGallery({ projectData, projectDataUpdateMethod }) {
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

                        {projectData.map(({ id, name, description, date_created, main_image_url }) => (
                            <div key={id} className={artStyles.artImageContainer}>
                                <Image
                                    src={main_image_url}
                                    height={500}
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