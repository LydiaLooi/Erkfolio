
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { tagsCollection } from '../collection_names';
import { TagDataInterface } from '../interfaces/firebase_interfaces';
import { getTagDataInterfaceFromDocumentData } from './utils';

export const fetchTags = async () => {
    const querySnapshot = await getDocs(collection(db, tagsCollection));

    const data: Array<TagDataInterface> = [];
    querySnapshot.forEach((doc) => {
        data.push(getTagDataInterfaceFromDocumentData(doc));
    });
    return data;
};