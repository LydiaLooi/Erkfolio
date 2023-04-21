import { getLogger } from "../../logging/log-util";
import resizeImage from "../../scripts/image_resizing";

const logger = getLogger("form-utils")

export async function testResize(imageFile?: File) {

    if (!imageFile) {
        logger.warn("No image has been selected yet")
        return
    }

    let resizedImageDiv = document.getElementById("resized-image");

    if (!resizedImageDiv) {
        throw new Error("Element resized-image could not be found")
    }

    // Select all <img> elements within the <div>
    let images = resizedImageDiv.querySelectorAll('img');

    // Loop through each <img> element and remove it from the <div>
    images.forEach(function (i) {
        i.remove();
    });

    let data = await resizeImage({ imageFile: imageFile })
    logger.info("Done!", data)

    // Check if the <div> element already contains an <img> element

    // Create a new <img> element and set its src attribute to the data URL of the resized image
    let img = document.createElement('img');
    img.src = data.dataUrl;

    // Append the <img> element to the <div> element with the id "resized-image"
    resizedImageDiv.appendChild(img);
}