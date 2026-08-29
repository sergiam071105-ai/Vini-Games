import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'shared.cloudflare.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'shared.fastly.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
      },
      {
        protocol: 'https',
        hostname: '**.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
      },
      {
        protocol: 'https',
        hostname: 'media.rawg.io',
      },
      {
        protocol: 'https',
        hostname: 'www.rockstargames.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.nintendo.com',
      },
      {
        protocol: 'https',
        hostname: 'media.nintendo.com',
      },
      {
        protocol: 'https',
        hostname: '**.nintendo.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
