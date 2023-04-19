import { useRef, useState } from "react"
import styles from "./form.module.css"
import { getLogger } from "../logging/log-util"
import Image from "next/image"

const logger = getLogger("image-thumbnail-grid")

export default function ImageThumbnailGrid({ images }) {
    // images minimum expected: [{title, description, file}]

    logger.debug("IMAGES", images)

    return (
        <div>
            <div className={`${styles.thumbnailGallery}`}>
                {images ? images.map(({ title, description, file }) => (
                    <div key={title} className={styles.thumbnailImageContainer}>
                        <Image
                            src={URL.createObjectURL(file)}
                            alt={title}
                            fill={true}

                        />
                        <div className={styles.thumbnailDetails}>
                            <span>{title}</span><br />
                            <small>{description}</small>
                        </div>

                    </div>

                )) : null}
            </div>
        </div>
    )
}