/** @type {import('next').NextConfig} */

const withPWA = require("@projectslab/next-pwa")({
    dest: "public",
    buildExcludes: [/app-build-manifest\.json/],
});

const nextConfig = {
    transpilePackages: ["@projectslab/ui", "@projectslab/helpers"],
    output: "standalone",
};

module.exports = withPWA(nextConfig);
