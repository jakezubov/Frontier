import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "frontier.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Create the directory if it doesn't exist
if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

// Try to create certificate if it doesn't exist
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    try {
        const result = child_process.spawnSync('dotnet', [
            'dev-certs',
            'https',
            '--export-path',
            certFilePath,
            '--format',
            'Pem',
            '--no-password',
        ], { stdio: 'inherit' });

        if (result.status !== 0) {
            console.warn('Warning: Failed to create HTTPS certificate.');
        }
    } catch (err) {
        console.warn('Warning: Failed to create HTTPS certificate.', err);
    }
}

// Configure HTTPS only if certificates exist
const httpsConfig = fs.existsSync(certFilePath) && fs.existsSync(keyFilePath)
    ? {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    }
    : false;

export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 5173,
        //https: httpsConfig,
        host: true
    }
})