import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-index-to-404',
      buildEnd() {
        // ビルド後に index.html を 404.html にコピー
        try {
          copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'));
        } catch (error) {
          console.error('404.html ファイルのコピーに失敗しました:', error);
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
