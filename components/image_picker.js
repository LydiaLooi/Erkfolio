import { useRef, useState } from "react"
import styles from "./form.module.css"


export default function ImagePicker({ handleData }) {

    const imageTitleInput = useRef()
    const imageDescriptionInput = useRef()
    const newImageInput = useRef()

    const [message, setMessage] = useState("")

    function imageChanged() {
        setMessage("")
    }

    function imagePicked() {
        let title = imageTitleInput.current?.value;
        let description = imageDescriptionInput.current?.value;
        let file = newImageInput.current?.files[0];

        if (!file) {
            setMessage("No file picked.")
            return
        }

        let data = {
            title,
            description,
            file,
        }

        handleData(data)
    }

    return (
        <div className={`${styles.imagePickerContainer}`}>
            <p className={`${styles.field}`}>
                <label>New Image </label><input name='projectImage' ref={newImageInput} onChange={imageChanged} type="file" placeholder="Image" />
            </p>
            <p className={`${styles.field}`}>
                <label>Image Title</label><input name='imageTitle' ref={imageTitleInput} type="text" placeholder="Title" />
            </p>
            <p className={`${styles.field}`}>
                <label>Image Description</label><textarea name='imageDescription' ref={imageDescriptionInput} type="text" placeholder="Description" />
            </p>
            {message ? <p><small>{message}</small></p> : null}
            <button type="button" onClick={imagePicked}>Add new image</button>
        </div>
    )
}