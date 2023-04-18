import ArtGallery from "./art_gallery";
import GalleryNavigation from "./gallery_nav";
import utilStyles from '../styles/utils.module.css'

export default function PaginatedGalleryLayout(
    {
        children,
        home,
        description,
        displayData,
        originalData,
        hideFilter,
        displayUpdateMethod,
        getMore
    }) {

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
                <button id="load-more-button" className="cool-button centred" onClick={getMore}>Load More</button>
            </div>
        </div>
    );
}
