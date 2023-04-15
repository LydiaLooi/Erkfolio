
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';

export const fetchArtByUid = async (uid) => {
    const docRef = doc(db, "art", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    data.id = uid
    return data;
};