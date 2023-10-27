/** @type {import('next').NextConfig} */

const nextConfig = {
    transpilePackages: ["@projectslab/ui", "@projectslab/helpers"],
    async rewrites() {
        return [
            {
                source: "/audio-encoder/:path*",
                destination: `http://localhost:${process.env.SERVER_PORT || 5001}/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
