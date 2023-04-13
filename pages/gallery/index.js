import Head from 'next/head';
import Layout from '../../components/layout';
import utilStyles from '../../styles/utils.module.css';


export default function Gallery({ allPostsData }) {


    return (
        <Layout>
            <Head>
                <title>Gallery</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>Wow!</p>
            </section>
        </Layout>
    );
}