import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import Layout from '../components/layout';

export default function AboutPage() {
    return (
        <Layout>
            <Head>
                <title>About</title>
            </Head>
            <p>This is a work in progress :)</p>
        </Layout>
    );
}
