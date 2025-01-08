import { networkInterfaces } from 'os';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getLocalIP() {
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }

    return '127.0.0.1';
}

function saveIPToEnv() {
    const localIP = getLocalIP();
    const envPath = join(__dirname, '../../.env');

    let envContent = '';
    if (existsSync(envPath)) {
        envContent = readFileSync(envPath, 'utf-8');
    }

    const newEnvContent = envContent
        .split('\n')
        .filter((line) => !line.startsWith('VITE_LOCAL_IP='))
        .concat(`VITE_LOCAL_IP=${localIP}`)
        .join('\n');

    writeFileSync(envPath, newEnvContent, 'utf-8');

    console.log(`IP guardada en el archivo .env: ${localIP}`);
}

saveIPToEnv();