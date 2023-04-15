import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import GalleryLayout from '../../components/gallery_layout';
import Layout from '../../components/layout';

import { longDedupingInterval } from '../../fetches/swr_config';

import useSWR from 'swr';
import { getLogger } from '../../logging/log-util';
import PaginatedGalleryLayout from '../../components/gallery_layout_paginated';
import { fetchPaginatedArtByRecent } from '../../fetches/paginated_all_art_by_recent';
const logger = getLogger("gallery-home")

export default function GalleryHome() {

    const _limitNum = 9

    logger.debug("GALLERY HOME")

    const [displayData, setDisplayArt] = useState([]);
    const [originalData, setOGCollection] = useState([])
    const [shouldFetch, setShouldFetch] = useState(true);

    const showButton = useRef(true);
    const lastRetrievedID = useRef("");
    const lastRetrievedDate = useRef("");
    const limitNum = useRef(_limitNum);

    const { data, error } = useSWR(
        shouldFetch ? [`fetchPaginatedArtByRecent-${lastRetrievedID.current}`, lastRetrievedID.current, lastRetrievedDate.current, limitNum.current] : null,
        fetchPaginatedArtByRecent,
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
            logger.debug("GALLERY USE EFFECT")

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
                lastRetrievedDate.current = data.slice(-1)[0].date_created
            }

            limitNum.current = _limitNum + 1

            let btn = document.getElementById("load-more-button");
            if (!showButton.current) {
                btn.style.display = "none";
            }

            logger.debug("THE LAST ONE WAS:", lastRetrievedDate.current, lastRetrievedID.current)
        }
    }, [data]);

    const heading = "Gallery"

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
            <PaginatedGalleryLayout
                heading={heading}
                displayUpdateMethod={setDisplayArt}
                displayData={displayData}
                originalData={originalData}
                hideFilter={false}
                getMore={getMore}
            />

        </div>
    );
}