import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout';
import Login from '../../components/login';
import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, storage, db } from '../../scripts/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore/lite'
import { auth } from '../../scripts/firebase';
import { getLogger } from "../../logging/log-util";
import resizeImage from '../../scripts/image_resizing';

const logger = getLogger("dashboard");
const collectionName = "test-collection";

function TestDashboardHome() {
    const form = useRef();

    const submitArt = (e) => {
        e.preventDefault();
        const name = form.current[0]?.value;
        const image = form.current[1]?.files[0];

        logger.debug(image)


        const storageRef = ref(storage, `${collectionName}/${image.name}`)

        $(document).on("imageResized", function (event) {
            logger.info("Image successfully resized")
            if (event.blob && event.url) {
                uploadBytes(storageRef, event.blob).then(
                    (snapshot) => {
                        getDownloadURL(snapshot.ref).then((downloadUrl) => {
                            saveData({ name, url: downloadUrl })
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
            await addDoc(collection(db, collectionName), artData)
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
                <p><label>Image*: </label><input name='image' type="file" placeholder="Image" required /></p>
                <button type="submit">Submit</button>
            </form>
            <button onClick={() => auth.signOut()}>Sign out</button>

        </div>
    )
}

export default function TestCollectionDashboard() {

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
                <title>TEST Dasboard</title>
            </Head>
            <h1>This is the TEST dashboard page</h1>

            {user ? <TestDashboardHome /> : <Login />}
        </Layout>
    );
}
