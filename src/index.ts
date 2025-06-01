import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import path from 'path';

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

console.log(`Will send message to: ${argv.to}`);
console.log(`Message: ${argv.message}`);

async function connectToWhatsApp() {
  // Store auth state in ./auth folder
  const authFolder = path.join(__dirname, '../auth');
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // We'll handle QR ourselves
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { qr, connection, lastDisconnect } = update;
    if (qr) {
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== 401;
      console.log('connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === 'open') {
      console.log('Connected to WhatsApp!!!');
      try {
        // Format the number to WhatsApp ID
        let to = argv.to as string;
        if (!to.endsWith('@s.whatsapp.net')) {
          // Remove any non-digit characters
          to = to.replace(/\D/g, '') + '@s.whatsapp.net';
        }
        const message = argv.message as string;
        console.log('Sending message to:', to);
        await sock.sendMessage(to, { text: message });
        console.log('Message sent!');
      } catch (err) {
        console.error('Failed to send message:', err);
      } finally {
        process.exit(0);
      }
    }
  });
}

connectToWhatsApp(); 