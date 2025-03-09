import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  const base = isProduction ? './' : '/'; // Use relative paths for production builds
  
  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
      },
    },
    root: path.resolve(__dirname, "client"),
    base, // Set the base path
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      // Ensure assets have the correct paths
      assetsDir: "assets",
      // Set public path to be relative
      assetsInlineLimit: 0,
    },
  };
});
