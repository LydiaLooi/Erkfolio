import Head from 'next/head';
import Layout from '../../components/layout';
import { fetchArtWithTagByRecent } from '../../fetches/all_art_with_tag_by_recent';

import PaginatedArtGallery from '../../components/gallery/paginated_art_gallery';
import { getLogger } from '../../logging/log-util';
const logger = getLogger("gallery-digital")


export default function DigitalGallery() {

    const limitNumber = 9
    const heading = "Digital Art Gallery"
    const tagName = process.env.DIGITAL_GALLERY_TAG
    const description = "This gallery is for the art that I create digitally - often using some sort of software (often FireAlpaca or Photoshop) and my drawing tablet."
    return (
        <div>
            <Layout>
                <Head>
                    <title>{heading}</title>
                </Head>
            </Layout>
            <PaginatedArtGallery
                title={heading}
                description={description}
                limitAmount={limitNumber}
                fetchArtMethod={fetchArtWithTagByRecent}
                fetchArtMethodName={`fetchArtWithTagByRecent-${tagName}`}
            />
        </div>
    );
}