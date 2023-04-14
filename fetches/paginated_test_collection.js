
import { collection, getDocs, limit, orderBy, query, startAt, where } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';

export const fetchTestCollection = async ([lastUrl, limitNum]) => {

    console.log("Bruh", [lastUrl, limitNum]);

    console.warn("lastUrl", lastUrl)

    const q = query(
        collection(db, 'test-collection'),
        orderBy('url', 'asc'),
        limit(limitNum),
        startAt(lastUrl),

    );
    const querySnapshots = await getDocs(q);
    const data = [];

    querySnapshots.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
};