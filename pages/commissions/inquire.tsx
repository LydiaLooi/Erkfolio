import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css"
import CommissionNavigation from "../../components/commision_nav";
import Link from "next/link";
import CommissionStatus from "../../components/commission_status";

export default function CommissionInquiry() {
    return (
        <>
            <Layout>
                <Head>
                    <title>Commission Me</title>
                </Head>

                <CommissionStatus />

                <h2 className={utilStyles.underline}>Inquire about a Commission</h2>

                <CommissionNavigation />
                <div className={utilStyles.paddingX15px}>

                    <p><i>Before continuing, ensure that you have read and understood the <Link href="/commissions/tos">Terms of Services</Link>.</i></p>

                    If you'd like the inquire about a commission, contact me on one of the following platforms:
                    <ul>
                        <li>Discord: <i>@erkfir</i></li>
                        <li>Instagram: <i><a href="https://www.instagram.com/erkfir">@erkfir</a></i></li>
                        <li>Email: <i>erkfir@gmail.com</i></li>
                    </ul>
                    <p>Please include the following information:</p>
                    <ul>
                        <li>A textual description of what you're after (including character/s, pose, expression, background, other elements, and other relevant details)</li>
                        <li>Visual references for your character/s</li>
                        <li>Visual references for other elements (pose, background, etc.)</li>
                        <li>Mentions of any of my existing artwork that you'd like the style of the commission to be similar to.</li>
                        <li>Confirm your availability for communication <small>(see <Link href="/commissions/tos#communication">ToS: Communication and Client Responsibilities</Link>)</small></li>
                        <li>Another other information you think might be relevant.</li>
                    </ul>
                </div>

            </Layout>
        </>
    );
}
