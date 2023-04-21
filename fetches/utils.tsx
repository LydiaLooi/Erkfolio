import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore/lite";
import { ArtInterface, ProjectDataInterface, TagDataInterface } from "../interfaces/firebase_interfaces";

export function getArtInterfaceFromDocumentData(doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): ArtInterface {

    let data = doc.data();
    if (!data) {
        throw new Error("Data is undefined from DocumentData")
    }

    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        date_created: data.date_created,
        pinned: data.pinned,
        dump: data.dump,
        tagsArray: data.tagsArray,
        url: data.url
    }
}

export function getProjectDataInterfaceFromDocumentData(doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): ProjectDataInterface {
    let data = doc.data();
    if (!data) {
        throw new Error("Data is undefined from DocumentData")
    }
    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        date_created: data.date_created,
        pinned: data.pinned,
        main_image_url: data.main_image_url,
        link: data.link,
        project_images: data.project_images,
    }
}

export function getTagDataInterfaceFromDocumentData(doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>): TagDataInterface {
    let data = doc.data();
    if (!data) {
        throw new Error("Data is undefined from DocumentData")
    }
    return {
        id: doc.id,
        name: data.name,
    }
}