
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { artCollection } from '../collection_names';
import { ArtInterface } from '../interfaces/firebase_interfaces';
import { getArtInterfaceFromDocumentData } from '../components/gallery/utils';

export const fetchArtByUid = async (uid: string) => {
    const docRef = doc(db, artCollection, uid);
    const docSnap = await getDoc(docRef);
    const data: ArtInterface = getArtInterfaceFromDocumentData(docSnap);
    return data;
};