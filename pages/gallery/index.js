import Head from 'next/head';
import { useEffect, useState } from 'react';
import GalleryLayout from '../../components/gallery_layout';
import Layout from '../../components/layout';

import { fetchAllArtByRecent } from '../../fetches/all_art_by_recent';
import { longDedupingInterval } from '../../fetches/swr_config';

import useSWR from 'swr';
import { getLogger } from '../../logging/log-util';
const logger = getLogger("gallery-home")

export default function GalleryHome() {

    const [displayData, setDisplayArt] = useState([]);
    const [originalData, setOGCollection] = useState([])

    const { data, error } = useSWR('all-art', fetchAllArtByRecent, {
        dedupingInterval: longDedupingInterval,
    })
    if (error) {
        logger.error("An error occured")
        logger.error(error)
    }
    if (!data) {
        logger.info("Loading data...")
    }

    useEffect(() => {
        if (data) {
            setDisplayArt(data);
            setOGCollection(data);
        }
    }, [data]);

    const heading = "Gallery"

    return (
        <div>
            <Layout>
                <Head>
                    <title>{heading}</title>
                </Head>
            </Layout>
            <GalleryLayout heading={heading} displayUpdateMethod={setDisplayArt} displayData={displayData} originalData={originalData} hideFilter={false} />
        </div>
    );
}