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




export default function DigitalGallery() {

    const [artData, setArtCollection] = useState([]);
    const [originalData, setOGCollection] = useState([])

    useEffect(() => {
        filterResults();
    }, []);

    async function filterResults() {
        const querySnapshot = await getDocs(query(collection(db, 'art'), where('tagsArray', 'array-contains', 'digital art'), orderBy('date_created', 'desc')));
        setArtCollection(querySnapshot.docs.map((doc) => doc.data()));
        setOGCollection(querySnapshot.docs.map((doc) => doc.data()))
    }


    return (
        <div>
            <Layout>
                <Head>
                    <title>Digital Art Gallery</title>
                </Head>


            </Layout>
            <GalleryLayout>
                <h2 className={utilStyles.underline}>Digital Art Gallery</h2>
                <GalleryNavigation></GalleryNavigation>
                <ArtGallery artData={artData} galleryUpdateMethod={setArtCollection} originalData={originalData} />
            </GalleryLayout>
        </div>
    );
}