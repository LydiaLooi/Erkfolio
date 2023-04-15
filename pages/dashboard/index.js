import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Login from '../../components/login';
import { auth } from '../../scripts/firebase';

import { getLogger } from "../../logging/log-util";
import { isAdminUUID as isAdminUID } from '../../scripts/utils';

const logger = getLogger("dashboard");

import ArtSubmissionForm from '../../components/art_submission_form';
import utilStyles from '../../styles/utils.module.css';


function UnauthorisedUser() {
    return (
        <div>
            <p>You ain't the real Erkfir :P</p>
        </div>
    )
}

function DashboardHome({ currentUser }) {
    return (
        <div>
            <p>You're logged in as: {currentUser.displayName}</p>
            {isAdminUID(currentUser.uid) ? <ArtSubmissionForm /> : <UnauthorisedUser />}
            <button className='cool-button-red centred margin-t-20px' onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}

export default function Dashboard() {

    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);


    return (
        <Layout>
            <Head>
                <title>Dasboard</title>
            </Head>
            <h2 className={utilStyles.underline}>Dashboard</h2>


            {user ? <DashboardHome currentUser={user} /> : <Login />}
        </Layout>
    );
}
