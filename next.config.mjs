/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',   // This generates a static 'out' folder
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
