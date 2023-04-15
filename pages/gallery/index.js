import Head from 'next/head';
import Layout from '../../components/layout';
import { fetchPaginatedArtByRecent } from '../../fetches/paginated_all_art_by_recent'

import PaginatedArtGallery from '../../components/paginated_art_gallery';

import { getLogger } from '../../logging/log-util';
const logger = getLogger("gallery-home")

export default function GalleryHome() {
    const limitNumber = 9
    const heading = "Gallery"
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
                fetchArtMethod={fetchPaginatedArtByRecent}
                fetchArtMethodName={"fetchPaginatedArtByRecent"}
            />
        </div>
    );
}