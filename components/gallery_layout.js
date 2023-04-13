import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import NavBar from './navbar';

const name = 'Erkfir';
export const siteTitle = 'Next.js Sample Website';

export default function GalleryLayout({ children, home }) {
    return (
        <div>
            <main>{children}</main>
        </div>
    );
}
