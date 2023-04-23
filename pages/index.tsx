import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { useEffect, useState } from 'react';
import ArtGallery from '../components/gallery/art_gallery';
import Link from 'next/link';
import useSWR from 'swr'
import { fetchPinnedArt } from '../fetches/pinned_art';
import { longDedupingInterval } from '../fetches/swr_config';
import { getLogger } from "../logging/log-util";
import { ArtInterface } from '../interfaces/firebase_interfaces';
import RecentActivity from '../components/recent_activity';

const logger = getLogger("home");

export default function Home() {

    logger.info("Home page loaded")

    const [artData, setArtCollection] = useState<Array<ArtInterface>>([]);

    const { data, error } = useSWR('pinned-art', fetchPinnedArt, {
        dedupingInterval: longDedupingInterval,
    })
    if (error) {
        logger.error("An error occured: ", error)
    }
    if (!data) {
        logger.info("Loading data...")
    }

    useEffect(() => {
        if (data) {
            setArtCollection(data);
        }
    }, [data]);


    return (
        <div>
            <Layout>
                <Head>
                    <title>Erkfir</title>
                </Head>
                <section >
                    <p className={utilStyles.paddingX15px} > Welcome to my art portfolio! This site is mainly for me to easily organise and show the different types of artwork that I do (i.e., traditional vs.digital). Enjoy~!</p>
                </section>
            </Layout>
            <h2 className={utilStyles.underline} >
                Pinned Works
            </h2>
            <ArtGallery
                artData={artData}
                hideFilter={true}
                galleryUpdateMethod={undefined}
                originalData={artData}
            />

            <div className={utilStyles.marginBottom50px}>
                <Link className='cool-button centred' href="/gallery" > See Full Gallery </Link>
            </div>
            <Layout showHeader={false}>
                <RecentActivity />
            </Layout>
        </div>
    );
}

