import { useEffect, useState } from 'react';
import styles from './layout.module.css';
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { getLogger } from '../logging/log-util';

const logger = getLogger('filters')

export default function Filters() {

    const [filterNames, setFilters] = useState([]);

    useEffect(() => {
        getFilters();
    }, []);

    async function getFilters() {
        const querySnapshot = await getDocs(collection(db, 'filters'));
        setFilters(querySnapshot.docs.map((doc) => doc.data()));
        logger.debug(filterNames)
    }

    return (
        <div className={styles.container}>
            <p>Filters...?</p>
        </div>
    )
}