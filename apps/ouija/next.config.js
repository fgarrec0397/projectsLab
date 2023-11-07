/** @type {import('next').NextConfig} */

const nextConfig = {
    transpilePackages: ["@projectslab/ui", "@projectslab/helpers"],
    output: "standalone",
    async rewrites() {
        return [
            {
                source: "/audio-encoder/:path*",
                destination: `http://localhost:${process.env.PORT || 3001}/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
