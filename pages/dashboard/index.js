import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout';
import Login from '../../components/login';
import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, storage, db } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore/lite'

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

        let tagsArray = [];

        tagsArray = tags.split(",").map(tag => tag.trim());

        const storageRef = ref(storage, `${artCollection}/${image.name}`)

        uploadBytes(storageRef, image).then(
            (snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadUrl) => {
                    saveData({ name, description, tagsArray, date_created, pinned, url: downloadUrl })
                }, (error) => {
                    console.error(error)
                    alert("Could not save...")

                })
            }, (error) => {
                console.error(error)
                alert("Could not save...")

            }
        )
    }

    const saveData = async (artData) => {
        console.log(artData)
        try {
            await addDoc(collection(db, artCollection), artData)
            window.location.reload(false); // reload if successful
        } catch (error) {
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

            <h2>
                <Link href="/">Back to home</Link>
            </h2>
        </Layout>
    );
}
