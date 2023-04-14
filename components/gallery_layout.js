import ArtGallery from "./art_gallery";
import GalleryNavigation from "./gallery_nav";
import utilStyles from '../styles/utils.module.css'

export default function GalleryLayout({ children, home, heading, displayData, originalData, hideFilter, displayUpdateMethod }) {

    return (
        <div>
            <h2 className={utilStyles.underline}>{heading}</h2>
            <GalleryNavigation></GalleryNavigation>
            <ArtGallery artData={displayData} galleryUpdateMethod={displayUpdateMethod} originalData={originalData} hideFilter={hideFilter} />
        </div>
    );
}
