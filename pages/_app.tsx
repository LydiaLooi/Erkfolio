import "@fortawesome/fontawesome-svg-core/styles.css";
import { AnimatePresence } from 'framer-motion';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

// https://www.slingacademy.com/article/how-to-use-font-awesome-with-next-js/
import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;

interface CustomPageProps { // https://stackoverflow.com/a/64722865
    // Props if needed go here
}

export default function App({ Component, pageProps }: AppProps<CustomPageProps>) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />

                <meta name="title" property="og:title" content="Erkfolio" />

                <meta name="description" property="og:description" content="A website to showcase Erkfir's art portfolio and projects" />

                <meta property="og:image" content="/images/profile.png" />
                <meta property="og:image:alt" content="Erkfir's drawing of a witch version of herself" />
                <meta property="og:type" content="website" />

                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <AnimatePresence
                key="app-animate-presence"
                initial={true}
                mode="wait">
                <Component {...pageProps} />
            </AnimatePresence>
            <footer className="footer"><small>Copyright &copy; 2023 Erkfir. All Rights Reserved</small></footer>
        </>
    );
}
