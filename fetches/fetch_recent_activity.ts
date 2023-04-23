
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { activityCollection } from '../collection_names';
import { RecentActivityInterface } from '../interfaces/firebase_interfaces';
import { getRecentActivityInterfaceFromDocumentData } from './utils';

export const fetchRecentActivity = async () => {
    const q = query(
        collection(db, activityCollection),
        where('action', '==', 'upload'),
        orderBy('date_created', 'desc'),
        limit(10)
    );
    const querySnapshot = await getDocs(q);
    const data: Array<RecentActivityInterface> = [];
    querySnapshot.forEach((doc) => {
        data.push(getRecentActivityInterfaceFromDocumentData(doc));
    });
    return data;
};