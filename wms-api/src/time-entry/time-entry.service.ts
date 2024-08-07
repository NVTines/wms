import { Injectable } from '@nestjs/common';
import { TimeEntryRepository } from './time-entry.repository';
import Service from '@/common/base.service';
import {
  CreateTimeEntryProjectDto,
  UpdateTimeEntryProjectDto,
  TimeEntryProject as TimeEntryProjectDto,
} from '@/.gen/dto';
import { TimeEntryProject } from '@/.gen/prisma-class/time_entry_project';

export interface ITimeEntryService extends Service {
  createMany(
    timeEntries:
      | Pick<TimeEntryProject, 'projectId' | 'hours' | 'employeeId'>[]
      | Partial<TimeEntryProject>[],
  ): Promise<TimeEntryProject[]>;
  updateMany(
    timeEntries: Partial<TimeEntryProject>[],
  ): Promise<TimeEntryProject | null>[];
}
@Injectable()
export class TimeEntryService
  extends Service<
    TimeEntryProject,
    TimeEntryProjectDto,
    CreateTimeEntryProjectDto,
    UpdateTimeEntryProjectDto
  >
  implements ITimeEntryService
{
  constructor(private readonly timeEntryRepository: TimeEntryRepository) {
    super();
    this._repository = timeEntryRepository;
  }
  createMany(
    timeEntries: Pick<TimeEntryProject, 'projectId' | 'hours' | 'employeeId'>[],
  ): Promise<TimeEntryProject[]> {
    if (timeEntries.length === 0) return Promise.resolve([]);
    return this.timeEntryRepository.createMany(timeEntries);
  }
  updateMany(
    timeEntries: Partial<TimeEntryProject>[],
  ): Promise<TimeEntryProject | null>[] {
    if (timeEntries.length === 0) return [Promise.resolve(null)];
    return this.timeEntryRepository.updateMany(timeEntries);
  }
}
export const ITimeEntryService = Symbol('IService');
