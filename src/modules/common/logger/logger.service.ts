import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { join } from 'path';

export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      }),
    );

    this.logger = winston.createLogger({
      level: 'info',
      format: logFormat,
      transports: [
        // 📁 Archivo local
        new winston.transports.File({
          filename: join(process.cwd(), 'logs/app.log'),
        }),
        // 🖥️ Consola
        new winston.transports.Console(),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message}${trace ? ' | TRACE: ' + trace : ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug?(message: string) {
    this.logger.debug?.(message);
  }

  verbose?(message: string) {
    this.logger.verbose?.(message);
  }
}
