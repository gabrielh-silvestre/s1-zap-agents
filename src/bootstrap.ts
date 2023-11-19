import qrcode from 'qrcode-terminal';
import { createRouterManager } from './routes';
import { StartAgentOpts } from './types';
import { Client } from 'whatsapp-web.js';

export const startAgent = async (
  client: Client,
  { route }: StartAgentOpts
): Promise<void> => {
  console.log('Starting...');
  client.initialize();

  createRouterManager(client, route);

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('authenticated', () => {
    console.log('AUTHENTICATED');
  });

  client.on('auth_failure', () => {
    console.log('AUTHENTICATION FAILURE');
  });

  client.on('ready', async () => {
    console.log('READY');
  });

  client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
  });

  process.on('SIGINT', async () => {
    console.log('(SIGINT) Shutting down...');
    await client.destroy();
    process.exit(0);
  });
};
