import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendTaskApprovalEmail(to: string, taskTitle: string, token: string): Promise<void> {
    const approvalLink = `${process.env.FRONTEND_URL}/tasks/respond/${token}`;

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || '',
      subject: 'Task Approval Request',
      text: `You have a new task: ${taskTitle}. Please review and respond using the link below: ${approvalLink}`,
      html: `<p>You have a new task: ${taskTitle}. Please review and respond using the link below: <a href="${approvalLink}">${approvalLink}</a></p>`
    };

    try {
      await sgMail.send(msg);
      logger.info(`Task approval email sent to ${to}`);
    } catch (error: unknown) {
      // Log the error details in a type-safe way
      logger.error('Error sending task approval email', error instanceof Error ? error : new Error(String(error)));
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}