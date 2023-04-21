
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../scripts/firebase';
import { projectCollection } from '../collection_names';
import { ProjectDataInterface } from '../interfaces/firebase_interfaces';
import { getProjectDataInterfaceFromDocumentData } from './utils';

export const fetchAllProjectsByRecent = async () => {
    const q = query(
        collection(db, projectCollection),
        orderBy('date_created', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const data: Array<ProjectDataInterface> = [];
    querySnapshot.forEach((doc) => {
        data.push(getProjectDataInterfaceFromDocumentData(doc));
    });
    return data;
};