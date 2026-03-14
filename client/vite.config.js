import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'figma-asset-resolver',
      enforce: 'pre',
      resolveId(source) {
        if (source.startsWith('figma:asset/')) {
          return `\0figma-asset:${source.replace('figma:asset/', '')}`;
        }
        return null;
      },
      load(id) {
        if (id.startsWith('\0figma-asset:')) {
          const fileName = id.replace('\0figma-asset:', '');
          return `import assetUrl from '/src/assets/${fileName}'; export default assetUrl;`;
        }
        return null;
      },
    },
  ],
});
