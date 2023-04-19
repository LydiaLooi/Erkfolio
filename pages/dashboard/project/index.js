import { onAuthStateChanged } from 'firebase/auth';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../../../components/layout';
import Login from '../../../components/login';
import { auth } from '../../../scripts/firebase';

import { getLogger } from "../../../logging/log-util";
import { isAdminUUID as isAdminUID } from '../../../scripts/utils';

const logger = getLogger("project-dashboard");

import utilStyles from '../../../styles/utils.module.css';
import ProjectSubmissionForm from '../../../components/project_submission_form';


function UnauthorisedUser() {
    return (
        <div>
            <p>You ain't the real Erkfir :P</p>
        </div>
    )
}

function ProjectDashboardHome({ currentUser }) {
    return (
        <div>
            <p>You're logged in as: {currentUser.displayName}</p>
            {isAdminUID(currentUser.uid) ? <ProjectSubmissionForm /> : <UnauthorisedUser />}
            <button className='cool-button-red centred margin-t-20px' onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}

export default function ProjectDashboard() {

    const [user, setUser] = useState(null);

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
                <title>Project Dasboard</title>
            </Head>
            <h2 className={utilStyles.underline}>Project Dashboard</h2>


            {user ? <ProjectDashboardHome currentUser={user} /> : <Login />}
        </Layout>
    );
}
