import { Resolver, Query, Mutation, Args, Int, Context, createUnionType, Info } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { KeycloakProfileGuard } from '@modules/common/keycloakProfile/keycloak_profile.guard';
import { UsersService } from '@modules/users/users.service';
import { CustomLogger } from '@modules/common/logger/logger.service';
import { ErrorResponse } from '@modules/common/graphql/error.model';
import { GraphQLResolveInfo } from 'graphql';
import * as graphqlFields from 'graphql-fields';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionInput, DeleteSubscriptionInput, GetSubscriptionsInput, Subscription } from '@modules/entities/subscription.entity';

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  constructor(
    private readonly subscriptionsService: SubscriptionsService ,
    private readonly userService: UsersService,
    private readonly logger: CustomLogger,
  ) {}


   @Query(() => [Subscription])
  @UseGuards(KeycloakProfileGuard)
  async getSubscriptions(
    @Args('input') input: GetSubscriptionsInput,
    @Context('req') req: any,
  ): Promise<Subscription []> {
    try {
      const userProfile = req.keycloakProfile;
      const user = await this.userService.findByAuthId(userProfile.sub);
      const subscriptions = await this.subscriptionsService.getSubscriptions(input, user);
      this.logger.log(`SubscriptionsResolver - getSubscriptions - userId: ${user.id}`);
      return subscriptions;
    }
    catch (err) {
      this.logger.error(`SubscriptionsResolver - getSubscriptions - params: ${JSON.stringify(input)}`, (err as Error).stack);
      throw new ErrorResponse(
        `SubscriptionsResolver - getSubscriptions - params: ${JSON.stringify(input)}`,
        '500',
        JSON.stringify((err as Error).stack)
      )
    }
  }

  @Mutation(() => Subscription)
  @UseGuards(KeycloakProfileGuard)
  async subscribe(
    @Args('input') input: CreateSubscriptionInput,
    @Context('req') req: any,
  ): Promise<Subscription> {
    try {
      const userProfile = req.keycloakProfile;
      const user = await this.userService.findByAuthId(userProfile.sub);
      const subscription = await this.subscriptionsService.createSubscription(input, user);
      this.logger.log(`SubscriptionsResolver - createSubscription - userId: ${user.id}`);
      return subscription;
    }
    catch (err) {
      this.logger.error(`SubscriptionsResolver - createSubscription - params: ${JSON.stringify(input)}`, (err as Error).stack);
      throw new ErrorResponse(
        `SubscriptionsResolver - createSubscription - params: ${JSON.stringify(input)}`,
        '500',
        JSON.stringify((err as Error).stack)
      )
    }
  }



  @Mutation(() => Subscription)
  @UseGuards(KeycloakProfileGuard)
  async unsubscribe(
    @Args('input') input: DeleteSubscriptionInput,
    @Context('req') req: any,
  ): Promise<Subscription> {
    try {
      const userProfile = req.keycloakProfile;
      const user = await this.userService.findByAuthId(userProfile.sub);
      const subscription = await this.subscriptionsService.unsubscribe(input, user);
      this.logger.log(`SubscriptionsResolver - deleteSubscription - userId: ${user.id}`);
      return subscription;
    }
    catch (err) {
      this.logger.error(`SubscriptionsResolver - createSubscription - params: ${JSON.stringify(input)}`, (err as Error).stack);
      throw new ErrorResponse(
        `SubscriptionsResolver - createSubscription - params: ${JSON.stringify(input)}`,
        '500',
        JSON.stringify((err as Error).stack)
      )
    }
  }




}