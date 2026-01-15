import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import { runTweego } from './.build/tweego.ts';

function tweegoPlugin(): Plugin {
  return {
    name: 'vite-plugin-tweego',
    closeBundle() {
      runTweego();
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'src/assets/media',

  build: {
    outDir: 'dist',
    emptyOutDir: !process.argv.includes('--watch'),
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      input: resolve(import.meta.dirname!, 'src/assets/app/index.ts'),
      output: {
        entryFileNames: 'scripts/app.bundle.js',
        chunkFileNames: 'scripts/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.css')) return 'styles/app.bundle.css';
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) return 'fonts/[name][extname]';
          return 'assets/[name][extname]';
        },
      },
    },
  },

  css: { devSourcemap: true },
  preview: { port: 4321 },

  plugins: [tweegoPlugin()],
});
