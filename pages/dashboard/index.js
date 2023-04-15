import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout';
import Login from '../../components/login';
import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, storage, db } from '../../scripts/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore/lite'

import { getLogger } from "../../logging/log-util";
import resizeImage from '../../scripts/image_resizing';

const logger = getLogger("dashboard");
const artCollection = "art";


function DashboardHome() {
    const form = useRef();

    const submitArt = (e) => {
        e.preventDefault();
        const name = form.current[0]?.value;
        const description = form.current[1]?.value;
        const tags = form.current[2]?.value;
        const date_created = form.current[3]?.value;
        const pinned = form.current[4]?.checked;
        const image = form.current[5]?.files[0];

        logger.debug(image)

        let tagsArray = [];

        tagsArray = tags.split(",").map(tag => tag.trim());

        const storageRef = ref(storage, `${artCollection}/${image.name}`)

        $(document).on("imageResized", function (event) {
            logger.info("Image successfully resized")
            if (event.blob && event.url) {
                uploadBytes(storageRef, event.blob).then(
                    (snapshot) => {
                        getDownloadURL(snapshot.ref).then((downloadUrl) => {
                            saveData({ name, description, tagsArray, date_created, pinned, url: downloadUrl })
                        }, (error) => {
                            logger.error(error)
                            alert("Could not save...")

                        })
                    }, (error) => {
                        logger.error(error)
                        alert("Could not save...")

                    }
                )
            }
        });

        resizeImage(image)

    }

    const saveData = async (artData) => {
        logger.debug(artData)
        try {
            await addDoc(collection(db, artCollection), artData)
            logger.info("Successfully added to collection.")
            window.location.reload(false); // reload if successful
        } catch (error) {
            logger.error(error)
            alert('Failed to add the data')
        }
    }

    return (
        <div>
            <p>You're logged in!</p>
            <form ref={form} onSubmit={submitArt}>

                <p><label>Name*: </label><input name='name' type="text" placeholder="Name" required /></p>
                <p><label>Description: </label><input name='description' type="text" placeholder="Description" /></p>
                <p><label>Tags: </label><input name='tags' type="text" placeholder="Tags" /></p>
                <p><label>Date created*: </label><input name='date_created' type="date" required /></p>
                <p><label>Pinned: </label><input name='pinned' type="checkbox" placeholder="false" /></p>
                <p><label>Image*: </label><input name='image' type="file" placeholder="Image" required /></p>
                <button type="submit">Submit</button>
            </form>
            <button onClick={() => auth.signOut()}>Sign out</button>

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
            <h1>This is the dashboard page</h1>

            {user ? <DashboardHome /> : <Login />}
        </Layout>
    );
}
