import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css"
import CommissionNavigation from "../../components/commision_nav";
import Link from "next/link";
import CommissionStatus from "../../components/commission_status";

export default function CommissionsHome() {
    return (
        <>
            <Layout>
                <Head>
                    <title>Commissions</title>
                </Head>

                <CommissionStatus />

                <h2 className={utilStyles.underline}>Prices + Samples</h2>

                <CommissionNavigation />
                <div className={utilStyles.paddingX15px}>
                    <p>This page is currently a work in progress! Though this doesn't mean that I'm not open for commissions.</p>
                    <p>If you would like to commission me, please read through the <Link href="/commissions/tos">Terms of Services</Link> before <Link href="/commissions/inquire">inquiring</Link> :D</p>
                </div>
            </Layout>
            {/* <div className="wrapper">
            </div> */}
        </>
    );
}
