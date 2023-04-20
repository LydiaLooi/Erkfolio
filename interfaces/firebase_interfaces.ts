export interface ArtInterface {
    id: string,
    name: string,
    description: string,
    date_created: string,
    pinned: boolean,
    dump: boolean,
    tagsArray: Array<string>,
    url: string
}

export interface FirebaseUser {
    uid: string
}