
import { collection, getDocs, limit, orderBy, query, startAt, where, documentId } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { artCollection } from '../collection_names';
import { ArtInterface } from '../interfaces/firebase_interfaces';
import { getArtInterfaceFromDocumentData } from './utils';

export const fetchPaginatedDumpArt = async ([unique, lastID, lastDate, limitNum]: [unqiue: string, lastID: string, lastDate: string, limitNum: number]) => {
    let q;
    if (lastID.length > 0) {
        q = query(
            collection(db, artCollection),
            where('dump', '==', true),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'asc'),
            limit(limitNum),
            startAt(lastDate, lastID),
        );
    } else {
        q = query(
            collection(db, artCollection),
            where('dump', '==', true),
            orderBy('date_created', 'desc'),
            orderBy(documentId(), 'asc'),
            limit(limitNum)
        )
    }
    const querySnapshot = await getDocs(q);
    const data: Array<ArtInterface> = [];
    querySnapshot.forEach((doc) => {
        data.push(getArtInterfaceFromDocumentData(doc));
    });
    return data;
};