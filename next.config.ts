import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // همه‌ی دامنه‌های supabase
      },
      {
        protocol: "https",
        hostname: "your-cdn.com", // 👈 اگه CDN یا دامنه‌ی دیگه داری اینجا اضافه کن
      },
    ],
  },
};

export default nextConfig;
