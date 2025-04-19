import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendTaskApprovalEmail(to: string, taskTitle: string, token: string): Promise<void> {
    const approvalLink = `${process.env.FRONTEND_URL}/tasks/respond/${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject: 'Task Approval Request',
      html: `
        <h1>Task Approval Request</h1>
        <p>You have a new task: ${taskTitle}</p>
        <p>Please review and respond using the link below:</p>
        <p><a href="${approvalLink}">Review Task</a></p>
        <p>This link will expire in 7 days.</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Task approval email sent to ${to}`);
    } catch (error) {
      logger.error('Error sending task approval email', error as Error);
      throw error;
    }
  }
}