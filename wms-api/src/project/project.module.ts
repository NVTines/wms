import { Module } from '@nestjs/common';

import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { PrismaModule } from '@/common/prisma/prisma.module';
import Service from '@/common/base.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
    {
      provide: Service,
      useClass: ProjectService,
    },
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
