import ArtGallery from "./art_gallery";
import GalleryNavigation from "./gallery_nav";
import utilStyles from '../styles/utils.module.css'

export default function PaginatedGalleryLayout(
    {
        children,
        home,
        heading,
        displayData,
        originalData,
        hideFilter,
        displayUpdateMethod,
        getMore
    }) {

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
            <div className={utilStyles.marginBottom50px}>
                <buttpm id="load-more-button" className="cool-button centred" onClick={getMore}>Load More</buttpm>
            </div>
        </div>
    );
}
