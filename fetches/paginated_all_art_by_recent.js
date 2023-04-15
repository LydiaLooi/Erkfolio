
import { collection, getDocs, limit, orderBy, query, startAt, where, documentId } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';


export const fetchPaginatedArtByRecent = async ([unique, lastID, lastDate, limitNum]) => {
    let q;
    if (lastID.length > 0) {
        q = query(
            collection(db, 'art'),
            where('dump', '==', false),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'asc'),
            limit(limitNum),
            startAt(lastDate, lastID),
        );
    } else {
        q = query(
            collection(db, 'art'),
            where('dump', '==', false),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'asc'),
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