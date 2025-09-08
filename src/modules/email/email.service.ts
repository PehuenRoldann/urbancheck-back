import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Urbancheck - Concepción del Uruguay" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html: html || text,
      });
      console.log('✅ Email enviado:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw new InternalServerErrorException('Error enviando correo');
    }
  }
}
