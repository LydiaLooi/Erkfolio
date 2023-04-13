import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import NavBar from './navbar';

const name = 'Erkfir';
export const siteTitle = "Erkfir";

function TopProfile(isHome) {


    return (
        <div>

            {isHome ? (
                <>
                    <Image
                        priority
                        src="/images/profile.png"
                        className={utilStyles.borderCircle}
                        height={144}
                        width={144}
                        alt=""
                    />
                    <h1 className={utilStyles.heading2Xl}>{name}</h1>
                </>
            ) : (
                <>
                    <Link href="/">
                        <Image
                            priority
                            src="/images/profile.png"
                            className={utilStyles.borderCircle}
                            height={108}
                            width={108}
                            alt=""
                        />
                    </Link>
                    <h2 className={utilStyles.headingLg}>
                        <Link href="/" className={utilStyles.colorInherit}>
                            {name}
                        </Link>
                    </h2>
                </>
            )}

        </div>
    )
}

export default function Layout({ children, home }) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="Erkfir's Art"
                    content="A website with Erkfir's art"
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            </Head>
            <header className={styles.header}>

                <TopProfile isHome='true'></TopProfile>
                <NavBar />
            </header>
            <main>{children}</main>
        </div >
    );
}
