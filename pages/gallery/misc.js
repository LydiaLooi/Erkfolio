import Head from 'next/head';
import Layout from '../../components/layout';
import { fetchPaginatedDumpArt } from '../../fetches/paginated_dump_art';

import PaginatedArtGallery from '../../components/paginated_art_gallery';

import { getLogger } from '../../logging/log-util';
const logger = getLogger("gallery-home")

export default function MiscGallery() {
    const limitNumber = 9
    const heading = "Misc Gallery"
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
                fetchArtMethod={fetchPaginatedDumpArt}
                fetchArtMethodName={"fetchPaginatedDumpArt"}
            />
        </div>
    );
}