import styles from "./form.module.css"
import { getLogger } from "../../logging/log-util"
import Image from "next/image"
import { ImagePickerData } from "./image_picker"

const logger = getLogger("image-thumbnail-grid")

interface ImageThumbnailGridProps {
    images: Array<ImagePickerData>
}

export default function ImageThumbnailGrid({ images }: ImageThumbnailGridProps) {

    logger.debug("IMAGES", images)

    return (
        <div>
            <div className={`${styles.thumbnailGallery}`}>
                {images ? images.map(({ title, description, resized }) => (
                    <div key={resized!.dataUrl} className={styles.thumbnailImageContainer}>
                        <Image
                            src={resized!.dataUrl}
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