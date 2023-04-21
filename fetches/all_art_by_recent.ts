
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { artCollection } from '../collection_names';
import { ArtInterface } from '../interfaces/firebase_interfaces';
import { getArtInterfaceFromDocumentData } from './utils';

export const fetchAllArtByRecent = async () => {
    const q = query(
        collection(db, artCollection),
        orderBy('date_created', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const data: Array<ArtInterface> = [];
    querySnapshot.forEach((doc) => {

        data.push(getArtInterfaceFromDocumentData(doc));
    });
    return data;
};