import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';


export default function Home() {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>Oh hi! This site is a work in progress :)</p>
                <p>Check out my socials if you wanna see my art... I guess?</p>
                <ul>
                    <li><a href="https://instagram.com/erkfir">Instagram</a></li>
                    <li><a href="https://twitter.com/erkfir">Twitter</a></li>

                </ul>
            </section>
        </Layout>
    );
}
