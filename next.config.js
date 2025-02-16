/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http", // đường link dẫn ảnh từ backend
        hostname: "localhost",
        port: "8000",
        pathname: "/images/**", // nơi hình ảnh xuất phát
      },
    ],
  },
};

module.exports = nextConfig;
