import { Inject, Injectable } from '@nestjs/common';

import BaseRepository from '@/common/base.repository';

import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from '@/.gen/dto';
import { Action } from '@/common/types';
import { PrismaClient } from '@prisma/client/extension';
import { Project } from '@/.gen/prisma-class/project';
import { TimeEntryProject, TypeProject } from '@prisma/client';

@Injectable()
export class ProjectRepository extends BaseRepository<
  Project,
  ProjectDto,
  CreateProjectDto,
  UpdateProjectDto
> {
  constructor(@Inject(PrismaService) private prisma: PrismaClient) {
    super(
      prisma.project as unknown as Action,
      {
        include: {
          timeEntries: true,
        },
      },
      (values) => {
        return {
          ...values,
          limit: +values.limit,
        };
      },
    );
  }
  async getProjectsByEmployeeIdWithYear(
    employeeId: string,
    year: number,
  ): Promise<Project[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);
    const projects = await this.prisma.project.findMany({
      where: {
        startedAt: {
          gte: startDate,
          lt: endDate,
        },
        timeEntries: {
          some: {
            employeeId: {
              equals: employeeId,
            },
          },
        },
      },
      include: {
        timeEntries: true,
      },
    });

    projects.forEach((project: Project) => {
      project.timeEntries = [
        ...project.timeEntries.filter(
          (timeEntry) => timeEntry.employeeId === employeeId,
        ),
      ];
    });

    return this.filterUniqueNames(projects);
  }
  getProjectsByEmployeeId(employeeId: string) {
    return this.prisma.project.findMany({
      where: {
        type: TypeProject.PROJECT,
        timeEntries: {
          some: {
            employeeId: employeeId,
          },
        },
      },
    });
  }
  private filterUniqueNames(projects: Project[]): Project[] {
    const map = new Map();
    return projects.filter((project) => {
      if (!map.has(project.id)) {
        map.set(project.id, true);
        return true;
      }
      return false;
    });
  }
}
