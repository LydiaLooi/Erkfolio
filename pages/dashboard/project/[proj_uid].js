import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import useSWR from 'swr'

import { getLogger } from "../../../logging/log-util";
const logger = getLogger("edit-art")

import { useRouter } from 'next/router'
import { fetchProjectById } from "../../../fetches/fetch_project_by_id";
import { longDedupingInterval } from "../../../fetches/swr_config";
import utilStyles from "../../../styles/utils.module.css"

import { auth } from "../../../scripts/firebase";
import { isAdminUUID } from "../../../scripts/utils";
import { onAuthStateChanged } from "@firebase/auth";
import ProjectSubmissionForm from "../../../components/project_submission_form";

export default function EditProject() {
    const router = useRouter()

    const [projectData, setProject] = useState()
    const [user, setUser] = useState(null);
    const [shouldFetch, setShouldFetch] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                if (isAdminUUID(user.uid)) {
                    setShouldFetch(true)
                } else {
                    router.push('/dashboard', undefined, { shallow: true })
                }
            } else {
                setUser(null);
                router.push('/dashboard', undefined, { shallow: true })
            }
        });
    }, []);

    const { proj_uid } = router.query

    const { data, error } = useSWR(
        shouldFetch ? proj_uid : null,
        fetchProjectById,
        {
            dedupingInterval: longDedupingInterval,
            onSuccess: () => {
                logger.info("Retrieved???")
            },
        }
    );

    if (error) {
        logger.error("An error occured while fetching data... redirecting to the dashboard")
        router.push('/dashboard', undefined, { shallow: true })
    }
    if (!data) {
        logger.info("Loading data...")
    }



    useEffect(() => {
        // Enable scroll...
        let body = document.getElementsByTagName("body")[0];
        body.style.height = "100vh";
        body.style.overflowY = "auto";

        if (data) {
            logger.info("SUCCESS", data)
            setProject(data);
        }
    }, [data]);


    return (
        <Layout>
            {user && isAdminUUID(user.uid) ?
                <div>
                    <h2 className={utilStyles.underline}>Editing Project...</h2>
                    <ProjectSubmissionForm editMode={true} existingData={projectData} />
                </div>
                : <p>Loading...</p>
            }

        </Layout>
    );
}
