import { Injectable } from '@nestjs/common';
import { EmailService } from '@modules/email/email.service';
import { EmailTemplates } from 'email-templates/email.templates';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { CreateSubscriptionInput, DeleteSubscriptionInput, GetSubscriptionsInput, Subscription } from '@modules/entities/subscription.entity';
import { User } from '@modules/entities/user.entity';
import { ErrorResponse } from '@modules/common/graphql/error.model';
import { subscription } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
    

    constructor(
        private readonly emailService: EmailService,
        private readonly prisma: PrismaService,
        private readonly logger: CustomLogger,
    ) {}


    async createSubscription(input: CreateSubscriptionInput, user: User): Promise<Subscription> {
        this.logger.log(`SubscriptionsService - createSubscription - Creating subscription for userId: ${user.id} with input: ${JSON.stringify(input)}`);

        try {

            const existingSubscription = await this.prisma.subscription.findFirst({
                where: {
                    user_id: user.id,
                    ticket_id: input.ticketId,
                },
                include: { user_account: true, ticket: true }
            });

            if (existingSubscription && existingSubscription?.dts !== null) {

                const subscription = await this.prisma.subscription.update({
                    where: { id: existingSubscription.id },
                    data: { dts: null }
                });

                this.logger.log(`SubscriptionsService - createSubscription - Reactivated existing subscription: ${JSON.stringify(subscription)}`);
                return subscription as unknown as Subscription;
                
            }

            if (existingSubscription && existingSubscription?.dts === null) {
                this.logger.warn(`SubscriptionsService - createSubscription - Subscription already exists for userId: ${user.id} and ticketId: ${input.ticketId}`);
                throw new ErrorResponse(
                    `SubscriptionsService - createSubscription - Subscription already exists for userId: ${user.id} and ticketId: ${input.ticketId}`,
                    '400',
                    'Subscription already exists'
                );
            }


            const subscription = await this.prisma.subscription.create({
                data: {
                    user_id: user.id,
                    ticket_id: input.ticketId,
                },
                include: { user_account: true, ticket: true },
            });


            this.logger.log(`SubscriptionsService - createSubscription - Subscription created successfully: ${JSON.stringify(subscription)}`);
            return subscription as unknown as Subscription;
        } catch (error) {
            this.logger.error(`SubscriptionsService - createSubscription - Error creating subscription`, (error as Error).stack);
            throw new ErrorResponse(
                `SubscriptionsService - createSubscription - Error creating subscription`,
                '500',
                JSON.stringify((error as Error).stack)
            );
        }
    }

    async unsubscribe(input: DeleteSubscriptionInput, user: User): Promise<Subscription> {
        this.logger.log(`SubscriptionsService - deleteSubscription - Deleting subscription id: ${input.ticketId} for userId: ${user.id}`);
        try {
            const existingSubscription = await this.prisma.subscription.findFirst({
                where: {
                    user_id: user.id,
                    ticket_id: input.ticketId,
                },
                include: { user_account: true, ticket: true }
            });

            if (!existingSubscription) {
                this.logger.warn(`SubscriptionsService - deleteSubscription - Subscription not found for id: ${input.subscriptionId} or ticketID: ${input.ticketId} and userId: ${user.id}`);
                throw new ErrorResponse(
                    `SubscriptionsService - deleteSubscription - Subscription not found for id: ${input.subscriptionId} or ticketID: ${input.ticketId}`,
                    '404',
                    'Subscription not found'
                );
            }


            const subscriptionsForTicket = await this.prisma.subscription.findMany({
                where: {
                    ticket_id: existingSubscription.ticket_id,
                    dts: null,
                },
                include: { user_account: true},
                orderBy: { its: 'asc' }
            });


            /* Check para que el autor del reclamo no pueda eliminar la subscripción. */
            if (subscriptionsForTicket.length > 0 && subscriptionsForTicket[0].id === existingSubscription.id) {
                this.logger.warn(`SubscriptionsService - deleteSubscription - The author is not allowed to delete their own subscription`);
                throw new ErrorResponse(
                    `SubscriptionsService - deleteSubscription - The author is not allowed to delete their own subscription`,
                    '403',
                    'The author is not allowed to delete their own subscription'
                );
            }

            

            const subscription = await this.prisma.subscription.update({
                where: { id: existingSubscription.id },
                data: { dts: new Date() },
                include: { user_account: true, ticket: true }
            });
            this.logger.log(`SubscriptionsService - deleteSubscription - Subscription deleted successfully id: ${existingSubscription.id}`);
            return subscription as unknown as Subscription ;

        } catch (error) {
            throw new ErrorResponse(
                `SubscriptionsService - deleteSubscription - Error deleting with parameters: ${JSON.stringify(input)}`,
                '500',
                JSON.stringify((error as Error).stack)
            );
        }
    }

    async getSubscriptions(input: GetSubscriptionsInput, user: User): Promise<Subscription[]> {
        
        this.logger.log(`SubscriptionsService - getSubscriptions - Fetching subscriptions for userId: ${user.id} with input: ${JSON.stringify(input)}`);
        const subscriptions: Subscription[] = [];

        try {
            const prismaSubscriptions = await this.prisma.subscription.findMany({
                where: {
                user_account: { id: user.id },
                ...(input.ticketId && { ticket_id: input.ticketId }),
                ...(input.active !== undefined &&
                    (input.active
                    ? { dts: null } // activos
                    : { NOT: { dts: null } } // inactivos
                    )
                ),
                },
                include: { user_account: true, ticket: true }
                });

            for (const sub of prismaSubscriptions) {
                subscriptions.push( sub as unknown as Subscription );
            }

        } catch (error) {
            this.logger.error(`SubscriptionsService - getSubscriptions - Error fetching subscriptions`, (error as Error).stack);
            throw new ErrorResponse(
                `SubscriptionsService - getSubscriptions - Error fetching subscriptions`,
                '500',
                JSON.stringify((error as Error).stack)
            );
        }

        return subscriptions;
    }

    async notifyStatusChange(ticketId: string, to: string) {

        this.logger.log(`SubscriptionsService - notifyStatusChange - Notifying status change for ticket ${ticketId} to ${to}`);

        const {subject, body} = EmailTemplates.getStatusChangedTemplate(ticketId, to);
        
        try {

            const subscriptions = await this.prisma.subscription.findMany({
                where: { 
                    ticket_id: ticketId,
                    dts: null
                },
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
