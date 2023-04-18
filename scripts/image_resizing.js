import { getLogger } from "../logging/log-util";
const logger = getLogger("image-resize");


/* Utility function to convert a canvas to a BLOB */
let dataURLToBlob = function (dataURL) {
    let BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        let parts = dataURL.split(',');
        let contentType = parts[0].split(':')[1];
        let raw = parts[1];

        return new Blob([raw], { type: contentType });
    }

    let parts = dataURL.split(BASE64_MARKER);
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
/* End Utility function to convert a canvas to a BLOB      */


export default function resizeImage({ imageFile, eventName = "imageResized", maxWidth = process.env.MAX_WIDTH, maxHeight = process.env.MAX_HEIGHT }) {
    logger.debug("Resizing")
    logger.debug(imageFile)

    // Load the image
    let reader = new FileReader();
    reader.onload = function (readerEvent) {
        logger.debug("loaded")
        let image = new Image();
        image.onload = function (imageEvent) {

            // Resize the image
            let canvas = document.createElement('canvas'),
                // max_size = Math.max(maxWidth, maxHeight),
                width = image.width,
                height = image.height;
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            canvas.width = width;
            canvas.height = height;

            logger.debug(`Resized image dimensions: ${width} x ${height} pixels`);

            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            let dataUrl = canvas.toDataURL('image/png');
            let resizedImage = dataURLToBlob(dataUrl);

            $.event.trigger({
                type: eventName,
                blob: resizedImage,
                url: dataUrl
            });
        }
        image.src = readerEvent.target.result;
    }
    reader.readAsDataURL(imageFile);

}
