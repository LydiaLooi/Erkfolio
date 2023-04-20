import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Layout from '../../components/layout';
import { fetchTestCollection } from '../../fetches/paginated_test_collection';
import utilStyles from '../../styles/utils.module.css'
import useSWR from 'swr';
import PaginatedGalleryLayout from '../../components/gallery/gallery_layout_paginated';
import { getLogger } from '../../logging/log-util';
import { longDedupingInterval } from '../../fetches/swr_config';
const logger = getLogger("art-dump")



export default function ArtDump() {
    logger.debug("ART DUMP")

    const _limitNum = 9

    const [displayData, setDisplayArt] = useState([]);
    const [originalData, setOGCollection] = useState([])
    const [shouldFetch, setShouldFetch] = useState(true);

    const showButton = useRef(true);
    const lastRetrievedID = useRef("");
    const lastRetrievedName = useRef("");
    const limitNum = useRef(_limitNum);

    const { data, error } = useSWR(
        shouldFetch ? [`fetchTestCollection-${lastRetrievedID.current}`, lastRetrievedID.current, lastRetrievedName.current, limitNum.current] : null,
        fetchTestCollection,
        {
            dedupingInterval: longDedupingInterval,
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

            // Check for button
            if (data.length < limitNum.current) {
                showButton.current = false
            }


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

            limitNum.current = _limitNum + 1

            let btn = document.getElementById("load-more-button");
            if (!showButton.current) {
                btn.style.display = "none";
            }

            logger.debug("THE LAST ONE WAS:", lastRetrievedName.current, lastRetrievedID.current)
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
            <h2 className={utilStyles.underline}>{heading}</h2>

            <PaginatedGalleryLayout
                displayUpdateMethod={setDisplayArt}
                displayData={displayData}
                originalData={originalData}
                hideFilter={false}
                getMore={getMore} />

        </div>
    );
}
