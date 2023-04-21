import { User, onAuthStateChanged } from 'firebase/auth';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../../components/layout';
import Login from '../../../components/login';
import { auth } from '../../../scripts/firebase';

import { getLogger } from "../../../logging/log-util";
import { isAdminUUID as isAdminUID } from '../../../scripts/utils';

const logger = getLogger("project-dashboard");

import utilStyles from '../../../styles/utils.module.css';
import ProjectSubmissionForm from '../../../components/forms/project_submission_form';
import Link from 'next/link';


function UnauthorisedUser() {
    return (
        <div>
            <p>You ain't the real Erkfir :P</p>
        </div>
    )
}

function ProjectDashboardHome({ currentUser }: { currentUser: User }) {
    return (
        <div>
            <Link href="/dashboard">Add an artwork instead</Link>

            <p>You're logged in as: {currentUser.displayName}</p>
            {isAdminUID(currentUser.uid) ? <ProjectSubmissionForm /> : <UnauthorisedUser />}
            <button className='cool-button-red centred margin-t-20px' onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}

export default function ProjectDashboard() {

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
                <title>Project Dasboard</title>
            </Head>
            <h2 className={utilStyles.underline}>Project Dashboard</h2>


            {user ? <ProjectDashboardHome currentUser={user} /> : <Login />}
        </Layout>
    );
}
