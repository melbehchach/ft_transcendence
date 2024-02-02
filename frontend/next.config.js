/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['cdn.intra.42.fr'],
        domains: ["images.unsplash.com"],
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'cdn.intra.42.fr',
        }
    ]
    },
};

module.exports = nextConfig;
