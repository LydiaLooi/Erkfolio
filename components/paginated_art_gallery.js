import { useEffect, useRef, useState } from 'react';


import useSWR from 'swr';
import PaginatedGalleryLayout from '../components/gallery_layout_paginated'
import { getLogger } from '../logging/log-util';
const logger = getLogger("paginated-art-gallery")

export default function PaginatedArtGallery({ title, limitAmount, fetchArtMethod, fetchArtMethodName }) {

    const _limitNum = limitAmount

    const [displayData, setDisplayArt] = useState([]);
    const [originalData, setOGCollection] = useState([])
    const [shouldFetch, setShouldFetch] = useState(true);

    const showButton = useRef(true);
    const lastRetrievedID = useRef("");
    const lastRetrievedDate = useRef("");
    const limitNum = useRef(_limitNum);

    logger.debug("SWR Unique:", `${fetchArtMethodName}-${lastRetrievedID.current}`)
    const { data, error } = useSWR(
        shouldFetch ? [`${fetchArtMethodName}-${lastRetrievedID.current}`, lastRetrievedID.current, lastRetrievedDate.current, limitNum.current] : null,
        fetchArtMethod,
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


    async function getMore() {
        logger.debug("Get more!", shouldFetch)
        setShouldFetch(true)
    }

    return (
        <PaginatedGalleryLayout
            heading={title}
            displayUpdateMethod={setDisplayArt}
            displayData={displayData}
            originalData={originalData}
            hideFilter={false}
            getMore={getMore}
        />
    );
}