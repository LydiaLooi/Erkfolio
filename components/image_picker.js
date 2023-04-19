

export default function ImagePicker({ handleData }) {

    function imagePicked() {
        handleData()
    }

    return (
        <div>
            <p>Image picker</p>
            <button type="button" onClick={imagePicked}>Yes!</button>
        </div>
    )
}