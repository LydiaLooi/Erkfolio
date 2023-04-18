import Head from 'next/head';
import Layout from '../../components/layout';
import { fetchArtWithTagByRecent } from '../../fetches/all_art_with_tag_by_recent';

import PaginatedArtGallery from '../../components/paginated_art_gallery';
import { getLogger } from '../../logging/log-util';
const logger = getLogger("gallery-traditional")


export default function TraditionalGallery() {

    const limitNumber = 9
    const heading = "Traditional Art Gallery"
    const tagName = process.env.TRADITIONAL_GALLERY_TAG
    return (
        <div>
            <Layout>
                <Head>
                    <title>{heading}</title>
                </Head>
            </Layout>
            <PaginatedArtGallery
                title={heading}
                limitAmount={limitNumber}
                fetchArtMethod={fetchArtWithTagByRecent}
                fetchArtMethodName={`fetchArtWithTagByRecent-${tagName}`}
            />
        </div>
    );
}