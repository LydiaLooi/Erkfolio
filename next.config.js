module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/v0/b/erkfolio.appspot.com/**',
            },
        ],
        minimumCacheTTL: 10,
    },
    env: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        LOG_LEVEL: process.env.LOG_LEVEL,
        ADMIN_UID: process.env.ADMIN_UID,
        MAX_HEIGHT: process.env.MAX_HEIGHT,
        MAX_WIDTH: process.env.MAX_WIDTH,
        ART_COLLECTION: process.env.ART_COLLECTION,
        TAG_COLLECTION: process.env.TAG_COLLECTION,
        PROJECT_COLLECTION: process.env.PROJECT_COLLECTION,
        DIGITAL_GALLERY_TAG: process.env.DIGITAL_GALLERY_TAG,
        TRADITIONAL_GALLERY_TAG: process.env.TRADITIONAL_GALLERY_TAG,
    }
}