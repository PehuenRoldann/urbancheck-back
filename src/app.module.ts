import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './modules/ticket/ticket.module';
import { TicketStatusModule } from './modules/ticket-status/ticket-status.module';
import { DependencyModule } from './modules/dependency/dependency.module';
import { EmailModule } from './modules/email/email.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { IssueModule } from './modules/issue/issue.module';

@Module({
  imports: [
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TicketModule,
    TicketStatusModule,
    DependencyModule,
    EmailModule,
    SubscriptionsModule,
    IssueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
