import Head from 'next/head';
import Image from 'next/image'
import Layout from '../../components/layout';
import GalleryLayout from '../../components/gallery_layout';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../../lib/firebase';
import ArtGallery from '../../components/gallery';
import utilStyles from '../../styles/utils.module.css'
import GalleryNavigation from '../../components/gallery_nav';



export default function GalleryHome() {

    const [artData, setArtCollection] = useState([]);
    const [originalData, setOGCollection] = useState([])

    useEffect(() => {
        getAllArtOrderedByRecency();
    }, []);

    async function getAllArtOrderedByRecency() {
        const querySnapshot = await getDocs(query(collection(db, 'art'), orderBy('date_created', 'desc')));
        setArtCollection(querySnapshot.docs.map((doc) => doc.data()));
        setOGCollection(querySnapshot.docs.map((doc) => doc.data()))
    }


    return (
        <div>
            <Layout>
                <Head>
                    <title>Gallery</title>
                </Head>
            </Layout>
            <GalleryLayout>
                <h2 className={utilStyles.underline}>Gallery</h2>
                <GalleryNavigation></GalleryNavigation>
                <ArtGallery artData={artData} galleryUpdateMethod={setArtCollection} originalData={originalData} />
            </GalleryLayout>
        </div>
    );
}