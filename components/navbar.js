import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../scripts/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isAdminUUID } from "../scripts/utils";


export default function NavBar() {

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
        <nav>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/about">About</Link>
                </li>
                <li>
                    <Link href="/gallery">Gallery</Link>
                </li>

                {user && isAdminUUID(user.uid) ? <li><Link href="/dashboard">Dashboard</Link></li> : null}
            </ul>
        </nav >
    )
}
