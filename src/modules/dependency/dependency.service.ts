import { Dependency } from '@modules/entities/dependency.entity';
import { Issue } from '@modules/entities/issue.entity';
import { PrismaService } from '@modules/prisma/prisma.service';
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
}
