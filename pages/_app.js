import Script from 'next/script';
import '../styles/globals.css';
import Head from 'next/head';
export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossOrigin="anonymous" />
            </Head>
            <Component {...pageProps} />
            <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js" integrity="sha384-UG8ao2jwOWB7/oDdObZc6ItJmwUkR/PfMyt9Qs5AwX7PsnYn1CRKCTWyncPTWvaS" crossOrigin="anonymous"></Script>

            <footer className="footer"><small>Copyright &copy; 2023 Erkfir. All Rights Reserved</small></footer>
        </>
    );
}
