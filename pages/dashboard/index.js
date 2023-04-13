import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout';
import Login from '../../components/login';
import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, storage, db } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc } from 'firebase/firestore/lite';
import { collection } from 'firebase/firestore/lite'

function DashboardHome() {
    const form = useRef();

    const submitTestCollection = (e) => {
        e.preventDefault();
        const name = form.current[0]?.value;
        const image = form.current[1]?.files[0];

        const storageRef = ref(storage, `test-collection/${image.name}`)

        uploadBytes(storageRef, image).then(
            (snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadUrl) => {
                    saveData({ name, url: downloadUrl })
                }, (error) => {
                    console.log(error);
                    saveData({ name, url: null })
                })
            }, (error) => {
                console.log(error)
                saveData({ name, url: null })
            }
        )
    }

    const saveData = async (test_data) => {
        console.log(test_data)
        try {
            await addDoc(collection(db, 'test-collection'), test_data)
            window.location.reload(false); // reload if successful
        } catch (error) {
            alert('Failed to add the test data')
        }
    }

    return (
        <div>
            <p>You're logged in!</p>
            <form ref={form} onSubmit={submitTestCollection}>

                <p><label>Name: </label><input name='name' type="text" placeholder="Name" /></p>
                <p><label>Image: </label><input name='image' type="file" placeholder="Image" /></p>
                <button type="submit">Submit</button>
                <button onClick={() => auth.signOut()}>Sign out</button>
            </form>
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
