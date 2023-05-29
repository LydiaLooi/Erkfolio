import Head from "next/head";
import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css"
import CommissionNavigation from "../../components/commision_nav";
import TermsOfServicesInfo from "../../components/tos_info";
import CommissionStatus from "../../components/commission_status";

export default function TermsOfServices() {
    return (
        <>
            <Layout>
                <Head>
                    <title>Terms of Services</title>
                </Head>
                <CommissionStatus />

                <h2 className={utilStyles.underline}>Terms of Services</h2>

                <CommissionNavigation />
                <TermsOfServicesInfo />
            </Layout>
        </>
    );
}
