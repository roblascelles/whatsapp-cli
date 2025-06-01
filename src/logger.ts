import pino from 'pino';
import path from 'path';
import fs from 'fs';

const logDirectory = path.join(__dirname, '../logs');

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logPath = path.join(logDirectory, 'app.log');

const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
}, pino.destination(logPath));

export default logger; 