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
            <p>Test Collection Data</p>
            {testData.map(({ name, url }) => (
                <Image
                    key={url}
                    priority
                    src={url}
                    className={utilStyles.borderCircle}
                    height={144}
                    width={144}
                    alt=""
                />
            ))}
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
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>Wow!</p>
            </section>
            <PostData allPostsData={allPostsData} />
            <TestCollectionData testData={testData} />
        </Layout>
    );
}
