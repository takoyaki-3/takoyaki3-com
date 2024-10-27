import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

export default defineConfig({
  base: '/', // デプロイするルートパスを必要に応じて設定
  plugins: [
    react(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        // ビルド後に index.html を 404.html にコピー
        copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'));
      },
    },
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        storybook: resolve(__dirname, 'dist/storybook/index.html'),
      },
    },
  },
});
