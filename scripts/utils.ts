
export function isAdminUUID(uid: string): boolean {
    return uid === process.env.ADMIN_UID;
}


export function getCurrentUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
}