import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import NavBar from './navbar';

const name = 'Erkfir';
export const siteTitle = "Erkfir";

function TopProfile(isHome) {


    return (
        <div>
            <Image
                src="/images/profile.png"
                className={`${utilStyles.borderCircle} ${utilStyles.block} ${utilStyles.marginAuto} ${utilStyles.profileImage} `}
                height={144}
                width={144}
                alt=""
            />
            <h1 className={`${utilStyles.heading2Xl} ${utilStyles.textAlignCentre}`}>{name}</h1>
        </div>
    )
}

function Socials() {
    return (
        <div id="social-test">
            <ul className="social">
                <li>
                    <a href="https://www.instagram.com/erkfir"><i className="fa fa-instagram" aria-hidden="true" /></a>
                </li>
                <li>
                    <a href="https://www.twitter.com/erkfir"><i className="fa fa-twitter" aria-hidden="true" /></a>
                </li>
            </ul>
        </div>
    )
}

export default function Layout({ children, home }) {
    return (
        <div className={styles.container}>

            <header className={styles.header}>

                <TopProfile isHome='true'></TopProfile>

                <Socials></Socials>

                <NavBar />
            </header>
            <main>{children}</main>
        </div >
    );
}
