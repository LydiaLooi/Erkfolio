import Head from 'next/head';
import Image from 'next/image'
import Layout from '../../components/layout';
import GalleryLayout from '../../components/gallery_layout';
import { useEffect, useState } from 'react';
import { fetchArtWithTagByRecent } from '../../fetches/all_art_with_tag_by_recent';

import useSWR from 'swr'
import { getLogger } from '../../logging/log-util';
import { longDedupingInterval } from '../../fetches/swr_config';
const logger = getLogger("gallery-digital")



export default function DigitalGallery() {

    const [displayData, setDisplayArt] = useState([]);
    const [originalData, setOGCollection] = useState([])

    let tagName = "digital art"

    const { data, error } = useSWR(
        ['all-digital-art', tagName],
        fetchArtWithTagByRecent,
        {
            dedupingInterval: longDedupingInterval,
        }
    );

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

    const heading = "Digital Art Gallery"

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