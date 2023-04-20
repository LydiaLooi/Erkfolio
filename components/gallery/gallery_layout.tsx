import ArtGallery from "./art_gallery";
import GalleryNavigation from "./gallery_nav";
import utilStyles from '../styles/utils.module.css'
import { ArtInterface } from "../../interfaces/firebase_interfaces";

interface GalleryLayoutProps {
    heading: string,
    displayData: Array<ArtInterface>,
    originalData: Array<ArtInterface>,
    hideFilter: boolean,
    displayUpdateMethod: (arg: Array<ArtInterface>) => void,
}

export default function GalleryLayout({ heading, displayData, originalData, hideFilter, displayUpdateMethod }: GalleryLayoutProps) {

    return (
        <div>
            <h2 className={utilStyles.underline}>{heading}</h2>
            <GalleryNavigation></GalleryNavigation>
            <ArtGallery
                artData={displayData}
                galleryUpdateMethod={displayUpdateMethod}
                originalData={originalData}
                hideFilter={hideFilter}
            />
        </div>
    );
}
