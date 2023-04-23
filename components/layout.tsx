import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import NavBar from './navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faInstagram,
    faTwitter
} from "@fortawesome/free-brands-svg-icons";
import { ReactNode } from 'react';

const name = 'Erkfir';
export const siteTitle = "Erkfir";

function TopProfile() {
    return (
        <div>
            <Image
                src="/images/profile.png"
                className={`${utilStyles.borderCircle} ${utilStyles.block} ${utilStyles.marginAuto} ${utilStyles.profileImage} `}
                height={144}
                width={144}
                alt="Erkfir's drawing of witch Erk"
                sizes="(max-width: 700px) 100px,
                144px"
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
                    <a href="https://www.instagram.com/erkfir" aria-label="Visit Erkfir's Instagram page">
                        <FontAwesomeIcon
                            icon={faInstagram}
                        />

                    </a>
                </li>
                <li>
                    <a href="https://www.twitter.com/erkfir" aria-label="Visit Erkfir's Twitter profile">
                        <FontAwesomeIcon
                            icon={faTwitter}
                        />
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default function Layout({ children, showHeader = true }: { children: ReactNode, showHeader?: boolean }) {
    return (
        <div className={styles.container}>
            {showHeader ?
                <header className={styles.header}>
                    <TopProfile />
                    <Socials />

                    <NavBar />
                </header>

                : null}

            <main>{children}</main>
        </div >
    );
}
