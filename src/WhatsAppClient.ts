import makeWASocket, { useMultiFileAuthState, WASocket } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import path from 'path';
import logger from './logger';

class WhatsAppClient {
  private sock: WASocket | null = null;
  private readyPromise: Promise<void>;
  private readyResolve!: () => void;
  private readyReject!: (err: any) => void;

  constructor() {
    this.readyPromise = new Promise((resolve, reject) => {
      this.readyResolve = resolve;
      this.readyReject = reject;
    });
  }

  async open() {
    const authFolder = path.join(__dirname, '../auth');
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });
    this.sock = sock;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { qr, connection, lastDisconnect } = update;
      if (qr) {
        qrcode.generate(qr, { small: true });
      }
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== 401;
        logger.info('connection closed. Reconnecting:', shouldReconnect);
        if (shouldReconnect) this.open();
      } else if (connection === 'open') {
        logger.info('Connected to WhatsApp!');
        this.readyResolve();
      }
    });

    return this.readyPromise;
  }

  async send(number: string, message: string) {
    if (!this.sock) throw new Error('WhatsApp connection not open');
    let to = number;
    if (!to.endsWith('@s.whatsapp.net')) {
      to = to.replace(/\D/g, '') + '@s.whatsapp.net';
    }
    logger.info(`Sending message to: ${to}`);
    await this.sock.sendMessage(to, { text: message });
    logger.info('Message sent!');
  }
}

export default WhatsAppClient; 