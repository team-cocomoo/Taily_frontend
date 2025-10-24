/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// __dirname 대체 (ESM용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: "./", // ✅ Amplify 정적 호스팅 안전 모드
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ cross-platform 안전
    },
  },
  // define: { global: {} }, // ⚠️ 필요할 때만 사용
  server: {
    proxy:
      process.env.NODE_ENV === "development"
        ? {
            "/api": {
              target: "https://taily24.store",
              changeOrigin: true,
              secure: false,
            },
            "/uploads": {
              target: "https://taily24.store",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.js",
  },
});
