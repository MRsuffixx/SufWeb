/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default config;
