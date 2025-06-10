import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Dependency } from '@modules/entities/dependency.entity';
import { DependencyService } from './dependency.service';
import { KeycloakProfileGuard } from '@modules/common/keycloakProfile/keycloak_profile.guard';
import { Issue } from '@modules/entities/issue.entity';

@Resolver()
export class DependencyResolver {

    constructor (
        private readonly dependencyService: DependencyService
    ) {}

    @Query(() => [Issue])
    @UseGuards(KeycloakProfileGuard)
    async findAllIssues(): Promise<Issue[]> {

        return await this.dependencyService.findAllIssues();
    }
}
