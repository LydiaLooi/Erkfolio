
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import { db } from '../lib/firebase';


export const fetchArtWithTagByRecent = async (inputData) => {
    let tagName = inputData[1]
    console.log("TAG")
    console.log(tagName)
    const q = query(
        collection(db, 'art'),
        where('tagsArray', 'array-contains', tagName),
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