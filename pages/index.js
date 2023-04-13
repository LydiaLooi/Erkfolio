import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import Date from '../components/date';
import Image from 'next/image';

import { getSortedPostsData } from '../lib/posts';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';

export async function getStaticProps() {
    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
}

function PostData({ allPostsData }) {
    return (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            <h2 className={utilStyles.headingLg}>Blog</h2>
            <ul className={utilStyles.list}>
                {allPostsData.map(({ id, date, title }) => (
                    <li className={utilStyles.listItem} key={id}>
                        <Link href={`/posts/${id}`}>{title}</Link>
                        <br />
                        <small className={utilStyles.lightText}>
                            <Date dateString={date} />
                        </small>
                    </li>
                ))}
            </ul>
        </section>
    )
}

function TestCollectionData({ testData }) {
    return (
        <section>
            <div class="wrapper">
                <div class="gallery">
                    <ul>
                        {testData.map(({ name, url }) => (
                            <li key={url}><Image
                                src={url}
                                // className={utilStyles.borderCircle}
                                height={200}
                                width={200}
                                alt=""
                            /></li>
                        ))}
                    </ul>
                </div>
            </div>
        </section >
    )
}

function GalleryComponent() {
    return (
        <section>
            <div class="wrapper">
                <div class="gallery">
                    <ul>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/9.png"></img></li>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/2.png"></img></li>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/3.png"></img></li>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/1.png"></img></li>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/4.png"></img></li>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/5.png"></img></li>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/7.png"></img></li>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/8.png"></img></li>
                        <li><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53819/6.png"></img></li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default function Home({ allPostsData }) {
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
            <Layout home>
                <Head>
                    <title>{siteTitle}</title>
                </Head>
                <section className={utilStyles.headingMd}>
                    <p>Wow!</p>
                </section>


                <PostData allPostsData={allPostsData} />
            </Layout>
            <TestCollectionData testData={testData} />

        </div>
    );
}
