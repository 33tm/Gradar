/** @type {import('next').NextConfig} */

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "asset-cdn.schoology.com",
                pathname: "/system/files/imagecache/profile_reg/courselogos/*",
            }
        ]
    },
    redirects: async () => [
        {
            source: "/app",
            destination: "/",
            missing: [
                { type: "cookie", key: "nonce" },
                { type: "cookie", key: "key" }
            ],
            permanent: false
        }
    ]
}