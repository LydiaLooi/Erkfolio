
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { projectCollection } from '../collection_names';

export const fetchProjectById = async (uid) => {
    console.warn("fetchProjectById... ", uid)
    const docRef = doc(db, projectCollection, uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    data.id = uid
    return data;
};