import { getLogger } from "../logging/log-util";
const logger = getLogger("image-resize");

/* Utility function to convert a canvas to a BLOB */
let dataURLToBlob = function (dataURL: string): Blob {
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

interface ResizeImageProps { imageFile: Blob, eventName: string, maxWidth?: number, maxHeight?: number }

const _maxWidth = parseInt(process.env.MAX_WIDTH || "0");
const _maxHeight = parseInt(process.env.MAX_HEIGHT || "0");

export default async function resizeImage({ imageFile, maxWidth = _maxWidth, maxHeight = _maxHeight }: ResizeImageProps) {
    logger.debug("Resizing")
    logger.debug(imageFile)

    // Load the image
    let reader = new FileReader();

    const fileLoadPromise = new Promise<Event>((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
    });

    reader.readAsDataURL(imageFile);
    const readerEvent = await fileLoadPromise;
    const fileReaderEvent = readerEvent as ProgressEvent<FileReader>; // Casting so that TS knows that it has a 'result' property

    logger.debug("loaded")

    const image = new Image();
    const imageLoadPromise = new Promise<Event>((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    image.src = fileReaderEvent.target!.result as string;
    await imageLoadPromise;

    // Resize the image
    const canvas = document.createElement('canvas');
    let width = image.width, height = image.height;
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

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Could not create canvas context");
    }

    ctx.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');
    const resizedImage = dataURLToBlob(dataUrl);

    return { blob: resizedImage, dataUrl }
}
