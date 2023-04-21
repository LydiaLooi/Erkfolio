
import { collection, getDocs, orderBy, query, where, documentId, limit, startAt } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { artCollection } from '../collection_names';
import { ArtInterface } from '../interfaces/firebase_interfaces';
import { getArtInterfaceFromDocumentData } from './utils';



export const fetchArtWithTagByRecent = async ([unique, lastID, lastDate, limitNum]: [unqiue: string, lastID: string, lastDate: string, limitNum: number]) => {
    // unique = fetchArtWithTagByRecent-tagName-lastID

    const arr = unique.split('-'); // split the string by '-'
    const tagName = arr[1]; // access the tagName from the resulting array

    let q;
    if (lastID.length > 0) {
        q = query(
            collection(db, artCollection),
            where('tagsArray', 'array-contains', tagName),
            where('dump', '==', false),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'asc'),
            limit(limitNum),
            startAt(lastDate, lastID),
        );
    } else {
        q = query(
            collection(db, artCollection),
            where('tagsArray', 'array-contains', tagName),
            where('dump', '==', false),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'asc'),
            limit(limitNum)
        );
    }

    const querySnapshot = await getDocs(q);
    const data: Array<ArtInterface> = [];
    querySnapshot.forEach((doc) => {
        data.push(getArtInterfaceFromDocumentData(doc));
    });
    return data;
};