import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import Service from '@/common/base.service';
import { UpdateProjectDto, ProjectDto, CreateProjectDto } from '@/.gen/dto';
import { Project } from '@/.gen/prisma-class/project';

export interface IProjectService extends Service {

  getProjectsByEmployeeId(employeeId: string): Promise<Project[]>;
  getProjectsByEmployeeIdWithYear(
    employeeId: string,
    year: number,
  ): Promise<Project[]>;
}
@Injectable()
export class ProjectService
  extends Service<Project, ProjectDto, CreateProjectDto, UpdateProjectDto>
  implements IProjectService
{
  constructor(private readonly projectRepository: ProjectRepository) {
    super();
    this._repository = projectRepository;
  }
  getProjectsByEmployeeId(employeeId: string): Promise<Project[]> {
    return this.projectRepository.getProjectsByEmployeeId(employeeId);
  }

  getProjectsByEmployeeIdWithYear(
    employeeId: string,
    year: number,
  ): Promise<Project[]> {

    return this.projectRepository.getProjectsByEmployeeIdWithYear(
      employeeId,
      year,
    );
  }
}
