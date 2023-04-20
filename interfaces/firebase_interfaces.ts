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

export interface ProjectImageInterface {
    title: string,
    url: string,
    description: string
}


export interface ProjectDataInterface {
    name: string,
    description: string,
    link: string,
    pinned: boolean,
    main_image_url: string,
    date_created: string,
    project_images: Array<ProjectImageInterface>
}


export interface FirebaseUser {
    uid: string
}