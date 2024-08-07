import { BaseController } from '@/common/base.controller';
import { Controller, ValidationPipe } from '@nestjs/common';
import { UpdateProjectDto, ProjectDto, CreateProjectDto } from '@/.gen/dto';
import { Project } from '@/.gen/prisma-class/project';
import Service from '@/common/base.service';

@Controller()
export class ProjectController extends BaseController<
  Project,
  unknown,
  unknown,
  unknown
>(Project, ProjectDto, CreateProjectDto, UpdateProjectDto, 'project', true) {
  constructor(private readonly projectService: Service<Project>) {
    super(projectService);
  }
}
