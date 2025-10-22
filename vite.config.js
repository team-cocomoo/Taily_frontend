import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: '/',
  // 빌드 출력(결과물이 저장될) 디렉토리 (기본값: dist)
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // src 폴더를 @로 참조
    },
  },
  define: {
    global: {},
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  
  },
  test: {
    globals: true,
    environment: "jsdom", // DOM 테스트용
    setupFiles: "./src/tests/setupTests.js",
  },
});
