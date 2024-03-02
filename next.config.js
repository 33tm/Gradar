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
    }
}