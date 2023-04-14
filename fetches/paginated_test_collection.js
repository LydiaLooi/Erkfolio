
import { collection, getDocs, limit, orderBy, query, startAt, where } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';
import { documentId } from 'firebase/firestore/lite';

export const fetchTestCollection = async ([lastID, lastName, limitNum]) => {

    console.log("Bruh", [lastID, lastName, limitNum]);

    console.warn("lastUrl", lastID)
    let q;
    if (lastID.length > 0) {
        q = query(
            collection(db, '/test-collection'),
            orderBy('name', 'asc'),
            orderBy(documentId(), 'asc'),
            limit(limitNum),
            startAt(lastName, lastID),

        );
    } else {
        q = query(
            collection(db, '/test-collection'),
            orderBy('name', 'asc'),
            orderBy(documentId(), 'asc'),
            limit(limitNum)
        )
    }

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