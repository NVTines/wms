import { Inject, Injectable } from '@nestjs/common';

import BaseRepository from '@/common/base.repository';

import { PrismaService } from '@/common/prisma/prisma.service';
import {
  CreateTimeEntryProjectDto,
  UpdateTimeEntryProjectDto,
  TimeEntryProject as TimeEntryProjectDto,
} from '@/.gen/dto';
import { TimeEntryProject } from '@/.gen/prisma-class/time_entry_project';
import { TimeEntryProject as _ } from '@prisma/client';
import { Action } from '@/common/types';
import { PrismaClient } from '@prisma/client/extension';
import { log } from 'console';

@Injectable()
export class TimeEntryRepository extends BaseRepository<
  TimeEntryProject,
  TimeEntryProjectDto,
  CreateTimeEntryProjectDto,
  UpdateTimeEntryProjectDto
> {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {
    super(prisma.timeEntryProject as unknown as Action, {
      include: {
        employee: true,
        project: true,
      },
    });
  }

  updateMany(
    timeEntries: Partial<TimeEntryProject>[],
  ): Promise<TimeEntryProject>[] {
    const promises = [];
    log(timeEntries);
    for (const timeEntry of timeEntries) {
      promises.push(
        this.prisma.timeEntryProject.update({
          where: { id: timeEntry.id },
          data: timeEntry as _,
        }),
      );
    }
    return Promise.all(promises) as unknown as Promise<TimeEntryProject>[];
  }

  async createMany(
    timeEntries: Pick<TimeEntryProject, 'projectId' | 'hours' | 'employeeId'>[],
  ): Promise<TimeEntryProject[]> {
    return this.prisma.$transaction(
      timeEntries.map((timeEntry) =>
        this.prisma.timeEntryProject.create({ data: timeEntry }),
      ),
    ) as unknown as Promise<TimeEntryProject[]>;
  }
}
