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
      html: `
        <h1>Task Approval Request</h1>
        <p>You have a new task: ${taskTitle}</p>
        <p>Please review and respond using the link below:</p>
        <p><a href="${approvalLink}">Review Task</a></p>
        <p>This link will expire in 7 days.</p>
      `
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