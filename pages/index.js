import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { useEffect, useState } from 'react';
import ArtGallery from '../components/gallery';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';
import Link from 'next/link';

import { getLogger } from "../logging/log-util";

const logger = getLogger("home");


export default function Home() {

    logger.info("Home page loaded")

    const [artData, setArtCollection] = useState([]);

    useEffect(() => {
        getPinned();
    }, []);

    async function getPinned() {
        const querySnapshot = await getDocs(query(collection(db, 'art'), where('pinned', '==', true), orderBy('date_created', 'desc')));
        setArtCollection(querySnapshot.docs.map((doc) => doc.data()));
    }


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
            <ArtGallery artData={artData} />

            <div className={utilStyles.marginBottom50px}>
                <Link className="cool-button" href="/gallery">See More</Link>
            </div>
        </div>
    );
}
