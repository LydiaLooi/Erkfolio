export interface ArtInterface {
    id: string,
    name: string,
    description: string,
    date_created: string,
    pinned: boolean,
    dump: boolean,
    tagsArray: Array<string>,
    url: string,
    linkText: string,
    linkUrl: string
}

export interface ProjectImageInterface {
    title: string,
    url: string,
    description: string,
}


export interface ProjectDataInterface {
    id: string,
    name: string,
    description: string,
    link: string,
    pinned: boolean,
    main_image_url: string,
    date_created: string,
    project_images: Array<ProjectImageInterface>,
}

export interface TagDataInterface {
    id?: string,
    name: string,
}

export interface RecentActivityInterface {
    id: string,
    action: string, // upload, edit, delete
    type: string, // digital, traditional, general, project
    title: string, // Title of the thing
    collection: string, //art, projects, ...
    date_created: string,
}

export interface UploadRecentActivityInterface {
    id?: string,
    action: string, // upload, edit, delete
    type: string, // digital, traditional, general, project
    title: string, // Title of the thing
    collection: string, //art, projects, ...
    date_created: string,
}