import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';


export default function Home() {


    return (
        <div>
            <Layout home>
                <Head>
                    <title>{siteTitle}</title>
                </Head>
                <section className={utilStyles.headingMd}>
                    <p>Wow!</p>
                </section>


            </Layout>
        </div>
    );
}
