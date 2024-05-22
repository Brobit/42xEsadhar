import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src/',
  publicDir: '../static/',
  base: './',
  server: {
    host: true, // Open to local network and display URL
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
  },
  build: {
    outDir: '../dist', // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    rollupOptions: {
      input: {
        homepage: resolve(__dirname, 'src/index.html'),
        game: resolve(__dirname, 'src/Game/game.html'),
        // homepage: resolve(__dirname, 'src/Home_page/index.html'), // Adjust as needed
      },
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  }
});
