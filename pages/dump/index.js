import Head from 'next/head';
import Layout from '../../components/layout';
import utilStyles from '../../styles/utils.module.css';
import { fetchTestCollection } from '../../fetches/paginated_test_collection';
import { useEffect, useState, useRef } from 'react';
import { longDedupingInterval } from '../../fetches/swr_config';

import useSWR from 'swr'
import { getLogger } from '../../logging/log-util';
import Link from 'next/link';
import PaginatedGalleryLayout from '../../components/gallery_layout_paginated';
const logger = getLogger("art-dump")



export default function ArtDump() {
    logger.debug("ART DUMP")
    const [displayData, setDisplayArt] = useState([]);
    const [originalData, setOGCollection] = useState([])
    const [shouldFetch, setShouldFetch] = useState(true);
    const lastRetrievedID = useRef("");
    const lastRetrievedName = useRef("");
    const limitNum = useRef(6);

    const { data, error } = useSWR(
        shouldFetch ? [`fetchTestCollection-${lastRetrievedID.current}`, lastRetrievedID.current, lastRetrievedName.current, limitNum.current] : null,
        fetchTestCollection,
        {
            dedupingInterval: 10000,
            onSuccess: () => {
                setShouldFetch(false)
            },
        }
    );

    if (error) {
        logger.error("An error occured")
        logger.error(error)
        setShouldFetch(false)
    }
    if (!data) {
        logger.info("Loading data...")
    }

    useEffect(() => {
        if (data) {
            logger.debug("ART DUUMP USE EFFECT")
            logger.debug("UHHH")
            setDisplayArt((prevDisplayData) => {
                if (prevDisplayData.length > 0) {
                    return prevDisplayData.concat(data.slice(1));
                } else {
                    return prevDisplayData.concat(data);
                }
            });

            setOGCollection((prevOGData) => {
                if (prevOGData.length > 0) {
                    return prevOGData.concat(data.slice(1));
                } else {
                    return prevOGData.concat(data);
                }
            });
            if (data.slice(-1)[0]) {
                lastRetrievedID.current = data.slice(-1)[0].id
                lastRetrievedName.current = data.slice(-1)[0].name
            }

            limitNum.current += 1
            logger.log("THE LAST ONE WAS:", lastRetrievedName.current, lastRetrievedID.current)
        }
    }, [data]);

    const heading = "Art Dump"

    async function getMore() {
        logger.debug("Get more!", shouldFetch)
        setShouldFetch(true)
    }

    return (
        <div>
            <Layout>
                <Head>
                    <title>{heading}</title>
                </Head>
            </Layout>
            <PaginatedGalleryLayout heading={heading} displayUpdateMethod={setDisplayArt} displayData={displayData} originalData={originalData} hideFilter={false} getMore={getMore} />

        </div>
    );
}
