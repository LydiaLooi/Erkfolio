import Head from 'next/head';
import Layout from '../../components/layout';
import { fetchArtWithTagByRecent } from '../../fetches/all_art_with_tag_by_recent';

import PaginatedArtGallery from '../../components/paginated_art_gallery';
import { getLogger } from '../../logging/log-util';
const logger = getLogger("gallery-digital")


export default function DigitalGallery() {

    const limitNumber = 9
    const heading = "Digital Art Gallery"
    const tagName = "digital art"
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