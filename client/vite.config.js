import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { templateCompilerOptions } from '@tresjs/core';

export default defineConfig({
  plugins: [
    vue({
      ...templateCompilerOptions,
    })
  ],
  server: { proxy: { '/api': 'http://localhost:3000' } },
});
