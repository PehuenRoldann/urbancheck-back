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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
