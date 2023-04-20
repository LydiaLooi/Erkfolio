import ArtGallery from "./art_gallery";
import GalleryNavigation from "./gallery_nav";
import utilStyles from '../../styles/utils.module.css'
import { ArtInterface } from "../../interfaces/firebase_interfaces";


interface PaginatedArtGalleryProps {
    description: string,
    displayData: Array<ArtInterface>,
    originalData: Array<ArtInterface>,
    hideFilter: boolean,
    displayUpdateMethod: (arg: Array<ArtInterface>) => void,
    methodToFetchMoreData: () => void
}

export default function PaginatedGalleryLayout(
    {
        description,
        displayData,
        originalData,
        hideFilter,
        displayUpdateMethod,
        methodToFetchMoreData
    }: PaginatedArtGalleryProps) {

    return (
        <div>
            <GalleryNavigation></GalleryNavigation>
            {description ? <div className={`${utilStyles.containerWidth} ${utilStyles.paddingX15px}`}><p>{description}</p></div> : null}
            <ArtGallery
                artData={displayData}
                galleryUpdateMethod={displayUpdateMethod}
                originalData={originalData}
                hideFilter={hideFilter}
            />
            <div className={utilStyles.marginBottom50px}>
                <button id="load-more-button" className="cool-button centred" onClick={methodToFetchMoreData}>Load More</button>
            </div>
        </div>
    );
}
