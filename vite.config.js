import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Electron 빌드 시 상대 경로로 리소스 로드
  server: {
    port: 5173,
    strictPort: true,
  },
});