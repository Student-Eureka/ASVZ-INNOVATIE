import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Voeg dit toe:
  experimental: {
    forceSwcTransforms: true
  },
  // Hostnames accepteren
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
  // Dit is de belangrijkste regel:
  devIndicators: { buildActivity: false },
  http: { allowHost: '*' } // ← LET OP: Next.js 13+ syntax, als je 12 gebruikt, zie onder
}

module.exports = nextConfig;


export default nextConfig;
