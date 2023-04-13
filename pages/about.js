import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import Layout from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export default function AboutPage() {
    return (
        <Layout>
            <Head>
                <title>About</title>
            </Head>
            <h2 className={utilStyles.underline}>About Me</h2>

            <p>This is a work in progress :)</p>
        </Layout>
    );
}
