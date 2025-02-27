import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 5173,
        host: '0.0.0.0',  // Enables access from other devices
        strictPort: true,  // Ensures consistent port usage
        allowedHosts: [
            'jewellery.zubov.com.au',
            'localhost'
        ]
    }
})