
import { collection, getDocs, orderBy, query, where, documentId, limit, startAt } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';


export const fetchArtWithTagByRecent = async ([unique, lastID, lastDate, limitNum]) => {
    // unique = fetchArtWithTagByRecent-tagName-lastID

    const arr = unique.split('-'); // split the string by '-'
    const tagName = arr[1]; // access the tagName from the resulting array

    let q;
    if (lastID.length > 0) {
        q = query(
            collection(db, 'art'),
            where('tagsArray', 'array-contains', tagName),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'desc'),
            limit(limitNum),
            startAt(lastDate, lastID),
        );
    } else {
        q = query(
            collection(db, 'art'),
            where('tagsArray', 'array-contains', tagName),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'desc'),
            limit(limitNum)
        );
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