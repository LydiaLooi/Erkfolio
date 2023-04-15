
import { collection, getDocs, limit, orderBy, query, startAt, where, documentId } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';


export const fetchPaginatedArtByRecent = async ([unique, lastID, lastDate, limitNum]) => {
    let q;
    if (lastID.length > 0) {
        q = query(
            collection(db, 'art'),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'desc'),
            limit(limitNum),
            startAt(lastDate, lastID),
        );
    } else {
        q = query(
            collection(db, 'art'),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'desc'),
            limit(limitNum)
        )
    }
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
};