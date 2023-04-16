
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { tagsCollection } from '../collection_names';

export const fetchTags = async () => {
    const querySnapshot = await getDocs(collection(db, tagsCollection));

    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
};