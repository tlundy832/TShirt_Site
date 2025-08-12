// ---------- next.config.js -----------------------------------
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.printify.com', // mock‑ups returned by Printify CDN
      },
    ],
  },
};
// -------------------------------------------------------------

