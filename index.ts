import { client } from './src/main';

process.on('SIGINT', async () => {
  console.log('(SIGINT) Shutting down...');
  await client.destroy();
  process.exit(0);
});
