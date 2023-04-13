import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { useEffect, useState } from 'react';
import GalleryLayout from '../components/gallery_layout';
import ArtGallery from '../components/gallery';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';
import Link from 'next/link';

export default function Home() {

    const [artData, setArtCollection] = useState([]);

    useEffect(() => {
        getPinned();
    }, []);

    async function getPinned() {
        const querySnapshot = await getDocs(query(collection(db, 'art'), where('pinned', '==', true)));
        setArtCollection(querySnapshot.docs.map((doc) => doc.data()));
    }


    return (
        <div>
            <Layout home>
                <Head>
                    <title>{siteTitle}</title>
                </Head>
                <section className={utilStyles.headingMd}>
                    <p>Welcome to my art collection! This site is mainly to organise my art and act as a portfolio of sorts. Enjoy~!</p>
                </section>

            </Layout>
            <h3 className={utilStyles.underline}>Pinned Works</h3>
            <ArtGallery artData={artData} />

            <div className={utilStyles.marginBottom50px}>
                <Link class="cool-button" href="/gallery">See More</Link>
            </div>
        </div>
    );
}
