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

    const [displayData, setDisplayArt] = useState([]);
    const [originalData, setOGCollection] = useState([])
    const [shouldFetch, setShouldFetch] = useState(true);
    const lastRetrievedID = useRef("");
    const lastRetrievedDate = useRef("");
    const limitNum = useRef(6);

    const { data, error } = useSWR(
        shouldFetch ? [lastRetrievedID.current, lastRetrievedDate.current, limitNum.current] : null,
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
            logger.warn("USE EFFECT")
            logger.log("UHHH")
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

            limitNum.current = 7
            logger.log("THE LAST ONE WAS:", lastRetrievedDate.current, lastRetrievedID.current)
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
            <PaginatedGalleryLayout heading={heading} displayUpdateMethod={setDisplayArt} displayData={displayData} originalData={originalData} hideFilter={false} getMore={getMore} />

        </div>
    );
}

//     const [displayData, setDisplayArt] = useState([]);
//     const [originalData, setOGCollection] = useState([])

//     const { data, error } = useSWR('all-art', fetchAllArtByRecent, {
//         dedupingInterval: longDedupingInterval,
//     })
//     if (error) {
//         logger.error("An error occured")
//         logger.error(error)
//     }
//     if (!data) {
//         logger.info("Loading data...")
//     }

//     useEffect(() => {
//         if (data) {
//             setDisplayArt(data);
//             setOGCollection(data);
//         }
//     }, [data]);

//     const heading = "Gallery"

//     return (
//         <div>
//             <Layout>
//                 <Head>
//                     <title>{heading}</title>
//                 </Head>
//             </Layout>
//             <GalleryLayout heading={heading} displayUpdateMethod={setDisplayArt} displayData={displayData} originalData={originalData} hideFilter={false} />
//         </div>
//     );
// }