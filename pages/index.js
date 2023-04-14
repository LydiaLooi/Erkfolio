import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { useEffect, useState } from 'react';
import ArtGallery from '../components/art_gallery';
import Link from 'next/link';
import useSWR from 'swr'
import { fetchPinnedArt } from '../fetches/pinned_art';
import { longDedupingInterval } from '../fetches/swr_config';
import { getLogger } from "../logging/log-util";

const logger = getLogger("home");


export default function Home() {

    logger.info("Home page loaded")

    const [artData, setArtCollection] = useState([]);

    const { data, error } = useSWR('pinned-art', fetchPinnedArt, {
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
            setArtCollection(data);
        }
    }, [data]);


    return (
        <div>
            <Layout home>
                <Head>
                    <title>{siteTitle}</title>
                </Head>
                <section>

                    <p>Welcome to my art portfolio! This site is mainly for me to easily organise and show the different types of artwork that I do (i.e., traditional vs. digital). Enjoy~!</p>
                </section>

            </Layout>
            <h3 className={utilStyles.underline}>Pinned Works</h3>
            <ArtGallery artData={artData} hideFilter={true} />

            <div className={utilStyles.marginBottom50px}>
                <Link className="cool-button" href="/gallery">See More</Link>
            </div>
        </div>
    );
}
