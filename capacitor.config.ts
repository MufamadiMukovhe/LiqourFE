import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'za.co.eclb.app',
  appName: 'ECLB',
  webDir: 'www',
  plugins: {
    'capacitor-document-viewer': {
      // Plugin-specific configurations if needed
    },
  },
};

export default config;
