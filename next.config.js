/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@livekit/components-react",
    "livekit-client",
    "livekit-server-sdk",
  ],
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
