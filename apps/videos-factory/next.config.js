/** @type {import('next').NextConfig} */

const withPWA = require("@projectslab/next-pwa")({
    dest: "public",
    buildExcludes: [/app-build-manifest\.json/],
    disable: false,
});

const nextConfig = {
    transpilePackages: ["@projectslab/ui", "@projectslab/helpers"],
    output: "standalone",
    modularizeImports: {
        "@mui/icons-material": {
            transform: "@mui/icons-material/{{member}}",
        },
        "@mui/material": {
            transform: "@mui/material/{{member}}",
        },
        "@mui/lab": {
            transform: "@mui/lab/{{member}}",
        },
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
};

module.exports = withPWA(nextConfig);
