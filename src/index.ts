import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import WhatsAppClient from './WhatsAppClient';
import logger from './logger';

const argv = yargs(hideBin(process.argv))
  .option('to', {
    type: 'string',
    demandOption: true,
    describe: 'Recipient phone number (with country code, e.g. 15551234567)'
  })
  .option('message', {
    type: 'string',
    demandOption: true,
    describe: 'Message to send'
  })
  .help()
  .parseSync();

(async () => {
  const client = new WhatsAppClient();
  await client.open();
  try {
    await client.send(argv.to as string, argv.message as string);
  } catch (err) {
    logger.error('Failed to send message:', err);
  } finally {
    process.exit(0);
  }
})(); 