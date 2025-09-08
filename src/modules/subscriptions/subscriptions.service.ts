import { Injectable } from '@nestjs/common';
import { EmailService } from '@modules/email/email.service';
import { EmailTemplates } from 'email-templates/email.templates';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CustomLogger } from '@modules/common/logger/logger.service';

@Injectable()
export class SubscriptionsService {

    constructor(
        private readonly emailService: EmailService,
        private readonly prisma: PrismaService,
        private readonly logger: CustomLogger,
    ) {}

    async notifyStatusChange(ticketId: string, to: string) {

        this.logger.log(`SubscriptionsService - notifyStatusChange - Notifying status change for ticket ${ticketId} to ${to}`);

        const {subject, body} = EmailTemplates.getStatusChangedTemplate(ticketId, to);
        
        try {

            const subscriptions = await this.prisma.subscription.findMany({
                where: { ticket_id: ticketId },
                include: { user_account: true }
            });

            for (const sub of subscriptions) {
                if (sub.user_account && sub.user_account.email) {
                    await this.emailService.sendEmail(sub.user_account.email, subject, body);
                    this.logger.log(`SubscriptionsService - notifyStatusChange - Email sent to ${sub.user_account.email} for ticket ${ticketId}`);
                }
            }

        } catch (error) {
            this.logger.error('SubscriptionsService - notifyStatusChange - Error fetching subscriptions', (error as Error).stack);
            return;
        }

    }

}
