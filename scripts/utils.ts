
export function isAdminUUID(uid: string): boolean {
    return uid === process.env.ADMIN_UID;
}