import { Dependency } from '@modules/entities/dependency.entity';
import { Issue } from '@modules/entities/issue.entity';
import { PrismaService } from '@modules/prisma/prisma.service';
import { DependencyLabels } from '@modules/utils/mappers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DependencyService {

    constructor (
        private readonly prisma: PrismaService
    ) {}

    async findAllIssues (): Promise<Issue[]> {

        const isuesDb = await this.prisma.issue.findMany();

        return isuesDb as unknown as Issue[];
    }


    async findOneById(id: number): Promise<Dependency> {

        const dependency_db = await this.prisma.dependency.findFirst({
            where: { id: id }
        });

        const dependency = dependency_db as unknown as Dependency;

        dependency!.name = DependencyLabels[dependency!.name];

        return dependency;

    }
}
