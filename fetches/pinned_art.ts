
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { artCollection } from '../collection_names';
import { getArtInterfaceFromDocumentData } from '../components/gallery/utils';
import { ArtInterface } from '../interfaces/firebase_interfaces';

export async function fetchPinnedArt() {
    const q = query(
        collection(db, artCollection),
        where('pinned', '==', true),
        orderBy('date_created', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const data: Array<ArtInterface> = [];
    querySnapshot.forEach((doc) => {
        data.push(getArtInterfaceFromDocumentData(doc));
    });
    return data;
};