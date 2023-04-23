
export function isAdminUUID(uid: string): boolean {
    return uid === process.env.ADMIN_UID;
}


export function getCurrentUnixTimestamp() {
    return Math.floor(Date.now() / 1000);
}

export function getTodaysDate() {
    let dateNow = new Date()
    const offset = dateNow.getTimezoneOffset()
    dateNow = new Date(dateNow.getTime() - (offset * 60 * 1000))
    return dateNow.toISOString().split('T')[0]
}