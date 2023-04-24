import Head from 'next/head';
import Layout from '../components/layout';
import Transition from '../components/transition';
import utilStyles from '../styles/utils.module.css';

export default function AboutPage() {
    return (
        <Layout>
            <Head>
                <title>About</title>
            </Head>
            <div className={utilStyles.paddingX15px}>
                <h2 className={utilStyles.underline}>About Me</h2>
                <Transition>

                    <p>Hello there! I'm Erkfir (Lydia), a software engineer and primarily self-taught hobbyist artist based in New Zealand.</p>
                    <p>I create art in both digital and traditional mediums, although I usually prefer digital because of the blessing that is CTRL + Z.</p>
                    <p>As you can see from the gallery, a lot of what I draw is fan art of things that I like, often various games. There is also the occasional personal art piece featuring one of my own characters.</p>
                    <p>I've been pretty inconsistent with drawing and painting, but I figured that creating a cool portfolio site might encourage me to create more art!</p>

                    <h3 className={utilStyles.underline}>Contact Me</h3>
                    Flick me a DM on <a href="https://instagram.com/erkfir">Instagram (@erkfir)</a> or Discord (Erkfir#9999)


                    <h3 className={utilStyles.underline}>What I Use</h3>
                    <h4>Software:</h4>
                    <ul>
                        <li>FireAlpaca <small>(for sketching + lines usually)</small></li>
                        <li>Adobe Photoshop <small>(for painting + polish)</small></li>
                    </ul>
                    <h4>Equipment:</h4>
                    <ul>
                        <li>Wacom Intuos Pen and Touch Medium Tablet...<small>The old version (CTH680). It's like 9 years old or something and barely surviving.</small></li>
                        <li>Pébéo Gouache paints</li>
                        <li>Pencils and stuff</li>
                    </ul>
                </Transition>
            </div>
        </Layout>
    );
}
