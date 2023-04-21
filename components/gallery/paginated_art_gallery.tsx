import { useEffect, useRef, useState } from 'react';
import utilStyles from '../../styles/utils.module.css'

import useSWR from 'swr';
import PaginatedGalleryLayout from './gallery_layout_paginated'
import { getLogger } from '../../logging/log-util';
import { longDedupingInterval } from '../../fetches/swr_config';
import { ArtInterface } from '../../interfaces/firebase_interfaces';
const logger = getLogger("paginated-art-gallery")

interface PaginatedArtGalleryProps {
    title: string,
    description: string,
    limitAmount: number,
    fetchArtMethod: (args: any) => Promise<Array<ArtInterface>>,
    fetchArtMethodName: string,
}

export default function PaginatedArtGallery({ title, description, limitAmount, fetchArtMethod, fetchArtMethodName }: PaginatedArtGalleryProps) {

    const _limitNum = limitAmount

    const [displayData, setDisplayArt] = useState<Array<ArtInterface>>([]);
    const [originalData, setOGCollection] = useState<Array<ArtInterface>>([])
    const [shouldFetch, setShouldFetch] = useState(true);

    const showButton = useRef(true);
    const lastRetrievedID = useRef("");
    const lastRetrievedDate = useRef("");
    const limitNum = useRef(_limitNum);

    logger.debug("SWR Unique:", `${fetchArtMethodName}-${lastRetrievedID.current}`)

    const { data, error } = useSWR(
        shouldFetch ? [
            `${fetchArtMethodName}-${lastRetrievedID.current}`,
            lastRetrievedID.current,
            lastRetrievedDate.current, limitNum.current
        ] : null,
        fetchArtMethod,
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

            // Check for button
            if (data.length < limitNum.current) {
                showButton.current = false
            }


            setDisplayArt((prevDisplayData) => {
                if (prevDisplayData.length > 0) {
                    let sliced = data.slice(1) as never
                    return prevDisplayData.concat(sliced);
                } else {
                    return prevDisplayData.concat(data as never);
                }
            });

            setOGCollection((prevOGData) => {
                if (prevOGData.length > 0) {
                    let sliced = data.slice(1) as never
                    return prevOGData.concat(sliced);
                } else {
                    return prevOGData.concat(data as never);
                }
            });
            if (data.slice(-1)[0]) {
                lastRetrievedID.current = data.slice(-1)[0].id
                lastRetrievedDate.current = data.slice(-1)[0].date_created
            }

            limitNum.current = _limitNum + 1

            let btn = getLoadMoreButtonElement();
            if (!showButton.current) {
                btn.style.display = "none";
            }

            logger.debug("THE LAST ONE WAS:", lastRetrievedDate.current, lastRetrievedID.current)
        }
    }, [data]);


    function getLoadMoreButtonElement() {
        let btn = document.getElementById("load-more-button");
        if (!btn) {
            throw new Error("Element load-more-button not found")
        }
        return btn
    }

    async function methodToFetchMoreData() {
        logger.debug("Get more!", shouldFetch)
        setShouldFetch(true)
    }

    return (
        <div>
            <h2 className={utilStyles.underline}>{title}</h2>
            <PaginatedGalleryLayout
                displayUpdateMethod={setDisplayArt}
                description={description}
                displayData={displayData}
                originalData={originalData}
                hideFilter={false}
                methodToFetchMoreData={methodToFetchMoreData}
            />
        </div>
    );
}