
import { collection, getDocs, limit, orderBy, query, startAt, where, documentId } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';

export const fetchTestCollection = async ([unique, lastID, lastName, limitNum]) => {

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