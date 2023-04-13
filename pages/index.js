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
                    <p>Hello! At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
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
