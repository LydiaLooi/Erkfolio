import { onAuthStateChanged, User } from "@firebase/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../scripts/firebase";
import { isAdminUUID } from "../scripts/utils";

export default function NavBar() {

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
        <div>
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
                    <li>
                        <Link href="/other">Other</Link>
                    </li>
                    {/*<li>
                    <Link href="/commissions">Commissions</Link>
                </li> */}
                    {user && isAdminUUID(user.uid) ?
                        <motion.li key="dashboard-nav" className={`absolute`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}>
                            <Link href="/dashboard">Dashboard</Link>
                        </motion.li>
                        : null}
                </ul>
            </nav >
        </div>
    )
}
