import Head from 'next/head';
import Image from 'next/image'
import Layout from '../../components/layout';
import utilStyles from '../../styles/utils.module.css';
import GalleryLayout from '../../components/gallery_layout';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../../lib/firebase';


function TestCollectionData({ testData }) {
    return (
        <section>
            <div className="wrapper">
                <div className="gallery">

                    {testData.map(({ name, url }) => (
                        <Image
                            key={url}
                            src={url}
                            height={500}
                            width={500}
                            alt={name}
                        />
                    ))}

                </div>
            </div>
        </section>
    )
}

export default function Gallery() {

    const [testData, setTestCollection] = useState([]);

    useEffect(() => {
        getTestCollection();
    }, []);

    async function getTestCollection() {
        const querySnapshot = await getDocs(collection(db, 'test-collection'));
        setTestCollection(querySnapshot.docs.map((doc) => doc.data()));
    }

    console.log(testData);

    return (
        <div>
            <Layout>
                <Head>
                    <title>Gallery</title>
                </Head>
            </Layout>
            <GalleryLayout>
                <TestCollectionData testData={testData} />
            </GalleryLayout>
        </div>
    );
}