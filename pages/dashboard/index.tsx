import { User, onAuthStateChanged } from 'firebase/auth';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Login from '../../components/login';
import { auth } from '../../scripts/firebase';

import { getLogger } from "../../logging/log-util";
import { isAdminUUID as isAdminUID } from '../../scripts/utils';

const logger = getLogger("dashboard");

import ArtSubmissionForm from '../../components/forms/art_submission_form';
import utilStyles from '../../styles/utils.module.css';
import Link from 'next/link';


function UnauthorisedUser() {
    return (
        <div>
            <p>You ain't the real Erkfir :P</p>
        </div>
    )
}

function DashboardHome({ currentUser }: { currentUser: User }) {
    return (
        <div>
            <Link href="/dashboard/project">Add a new project instead</Link>
            <p>You're logged in as: {currentUser.displayName}</p>
            {isAdminUID(currentUser.uid) ? <ArtSubmissionForm /> : <UnauthorisedUser />}
            <button className='cool-button-red centred margin-t-20px' onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}

export default function Dashboard() {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(undefined);
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
