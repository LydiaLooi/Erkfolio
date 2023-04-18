
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { artCollection } from '../collection_names';

export const fetchArtByUid = async (uid) => {
    const docRef = doc(db, artCollection, uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    data.id = uid
    return data;
};