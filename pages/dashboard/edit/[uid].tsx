import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import useSWR from 'swr'

import { getLogger } from "../../../logging/log-util";
const logger = getLogger("edit-art")

import { useRouter } from 'next/router'
import { fetchArtByUid } from "../../../fetches/fetch_art_by_id";
import { longDedupingInterval } from "../../../fetches/swr_config";
import ArtSubmissionForm from "../../../components/forms/art_submission_form";
import utilStyles from "../../../styles/utils.module.css"

import { auth } from "../../../scripts/firebase";
import { isAdminUUID } from "../../../scripts/utils";
import { onAuthStateChanged, User } from "@firebase/auth";
import { ArtInterface } from "../../../interfaces/firebase_interfaces";

export default function EditArt() {
    const router = useRouter()

    const [artData, setArt] = useState<ArtInterface>()
    const [user, setUser] = useState<User>();
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
                setUser(undefined);
                router.push('/dashboard', undefined, { shallow: true })
            }
        });
    }, []);

    const { uid } = router.query

    const { data, error } = useSWR(
        shouldFetch ? uid : null,
        fetchArtByUid,
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
            setArt(data);
        }
    }, [data]);


    return (
        <Layout>
            {user && isAdminUUID(user.uid) ?
                <div>
                    <h2 className={utilStyles.underline}>Editing Artwork...</h2>
                    <ArtSubmissionForm editMode={true} existingData={artData}></ArtSubmissionForm>
                </div>
                : <p>Loading...</p>
            }

        </Layout>
    );
}
