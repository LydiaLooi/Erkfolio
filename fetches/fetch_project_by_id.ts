
import { doc, getDoc } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { projectCollection } from '../collection_names';
import { getProjectDataInterfaceFromDocumentData } from './utils';

export const fetchProjectById = async (uid: string) => {
    console.warn("fetchProjectById... ", uid)
    const docRef = doc(db, projectCollection, uid);
    const docSnap = await getDoc(docRef);
    const data = getProjectDataInterfaceFromDocumentData(docSnap);
    return data;
};