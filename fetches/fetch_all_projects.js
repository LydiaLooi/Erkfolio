
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { projectCollection } from '../collection_names';

export const fetchAllProjectsByRecent = async () => {
    const q = query(
        collection(db, projectCollection),
        orderBy('date_created', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
};