import { EmailService, TransactionalEmailOptions } from "./mail";


/**
 * Default Transactional Mailer.
 * In development or when no dedicated transactional provider is configured,
 * logs the email contents cleanly and returns success.
 */
export class DefaultTransactionalEmailService implements EmailService {
  async sendEmail(options: TransactionalEmailOptions): Promise<{ success: boolean; id?: string }> {
    console.log("=========================================");
    console.log("      [Transactional Email Sent]");
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body:\n${options.text}`);
    console.log("=========================================");
    return { success: true, id: `tx_${Date.now()}` };
  }
}

export const defaultEmailService = new DefaultTransactionalEmailService();
