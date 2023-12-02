/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "uploadthing.com",
        port: "",
      },
      {
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
