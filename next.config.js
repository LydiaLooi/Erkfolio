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
    },
    env: {
        LOG_LEVEL: process.env.LOG_LEVEL
    }
}