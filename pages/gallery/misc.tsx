import Head from 'next/head';
import Layout from '../../components/layout';
import { fetchPaginatedDumpArt } from '../../fetches/paginated_dump_art';

import PaginatedArtGallery from '../../components/gallery/paginated_art_gallery';

import { getLogger } from '../../logging/log-util';
const logger = getLogger("gallery-home")

export default function MiscGallery() {
    const limitNumber = 9
    const heading = "Miscellaneous"
    const description = "This gallery is for images that I want to exclude from the main galleries... but still have them here because why not :)"
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
                fetchArtMethod={fetchPaginatedDumpArt}
                fetchArtMethodName={"fetchPaginatedDumpArt"}
            />
        </div>
    );
}