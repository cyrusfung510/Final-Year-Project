import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

const manifest = {
  registerType: "autoUpdate",
  includeAssets: ["**/*"],
  manifest: {
    name: "Instant Messaging Software",
    short_name: "IM",
    description: "Instant Messaging Software",
    icons: [
      {
        src: "./src/assets/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./src/assets/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#000000",
    background_color: "#ffffff",
    display: "standalone",
  },
  devOptions: {
    enabled: true,
  },
  workbox:{
    globalPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg}"],
    runtimeCaching:[
      {
        urlPattern: /\/(users|chatRoom|quiz)/,
        handler: "CacheFirst",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24,
          },
        },
      }
    ]
  },
  strategies: "injectManifest",
  srcDir: "public",
  filename: "sw.js",
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  VitePWA(manifest)],
});
