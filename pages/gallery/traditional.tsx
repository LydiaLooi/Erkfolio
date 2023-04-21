import Head from 'next/head';
import Layout from '../../components/layout';
import { fetchArtWithTagByRecent } from '../../fetches/all_art_with_tag_by_recent';

import PaginatedArtGallery from '../../components/gallery/paginated_art_gallery';
import { getLogger } from '../../logging/log-util';
const logger = getLogger("gallery-traditional")


export default function TraditionalGallery() {

    const limitNumber = 9
    const heading = "Traditional Art Gallery"
    const tagName = process.env.TRADITIONAL_GALLERY_TAG
    const description = "This category is for the art that I create with non-digital mediums (such as pencils/pens, paints, ...). "
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