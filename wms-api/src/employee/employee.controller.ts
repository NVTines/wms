import { BaseController } from '@/common/base.controller';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  Employee,
  EmployeeDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  TimeEntryProject as _,
} from '@/.gen/dto/';
import Service from '@/common/base.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { capitalize } from 'lodash';
import { Message } from '@/common/decorators/message.decorator';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Authorizer } from '@/auth/decorators/authenticator.decorator';
import { ITimeEntryService, TimeEntryService } from '@/time-entry';

import { TimeEntryProject } from '@/.gen/prisma-class/time_entry_project';
import { getWeekNumber } from '@/utils/Date';
import { Role, TypeProject } from '@prisma/client';
import { IProjectService, ProjectService } from '@/project';

@Controller()
@UseGuards(AuthGuard)
export class EmployeeController extends BaseController<
  Employee,
  unknown,
  unknown,
  unknown
>(
  Employee,
  EmployeeDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  'employee',
  true,
) {
  constructor(
    private readonly employeeService: Service<Employee>,
    @Inject(ProjectService)
    private readonly projectService: IProjectService,
    @Inject(TimeEntryService)
    private readonly timeEntryService: ITimeEntryService,
  ) {
    super(employeeService);
  }

  @Put('/employee/time-entries')
  @Message.Success({
    message: `${capitalize('time-entry')} found`,
    status: 201,
  })
  @Message.Error({
    message: `${capitalize('time-entry')} not found`,
    status: 201,
  })
  @ApiBearerAuth('JWT-auth')
  async updateOrCreateTimeEntriesEmployee(
    @Authorizer() payload: { sub: string; employee: Employee },
    @Body() timeEntries: Partial<TimeEntryProject>[],
  ) {
    const timeEntriesEmployee = (await this.timeEntryService.findMany({
      employeeId: payload.sub,
    })) as _[];

    const countLeft: Record<string, Record<string, number>> = {};

    timeEntriesEmployee.forEach((timeEntry) => {
      if (timeEntry.project?.type === TypeProject.LEAVE) {
        const year = new Date(timeEntry.date!).getFullYear().toString();
        Object.assign(countLeft, {
          ...countLeft,
          [year]: {
            ...countLeft[year],
            [timeEntry.project.code]:
              (countLeft[year]?.[timeEntry.project.code] || 0) + 1,
          },
        });
      }
    });

    const countLeave: Record<string, Record<string, number>> = {};

    const timeEntriesUpdate: Partial<TimeEntryProject>[] = [],
      timeEntriesCreate: Partial<TimeEntryProject>[] = [];
    let invalid = false;
    for (const timeEntry of timeEntries) {
      const year = new Date(timeEntry.date!).getFullYear().toString();

      if (timeEntry.project?.type === TypeProject.LEAVE) {
        Object.assign(countLeave, {
          ...countLeave,
          [year]: {
            ...countLeave[year],
            [timeEntry.project.code]:
              (countLeave[year]?.[timeEntry.project.code] || 0) + 1,
          },
        });
      }

      if (timeEntry.project?.code) {
        const left: number = countLeft?.[year]?.[timeEntry.project.code!] || 0;
        const leave: number =
          countLeave?.[year]?.[timeEntry.project.code!] || 0;

        console.log(
          'timeEntry.project.code',
          year,
          leave,
          timeEntry.project.limit!,
        );
        if (
          leave > timeEntry.project.limit! &&
          payload.employee.role === Role.EMPLOYEE
        ) {
          invalid = true;
          return {
            data: null,
            message: `${timeEntry.project.code} đã hết lượt nghỉ phép trong năm ${year}`,
            status: 400,
          };
        }
      }
      if (timeEntry?.id) {
        const { date, employee, project, employeeId, projectId, ...rest } =
          timeEntry;
        timeEntriesUpdate.push({
          ...rest,
        });
      } else {
        const current = getWeekNumber(new Date())[1];
        const _ = getWeekNumber(new Date(timeEntry.date!))[1];
        if (current !== _ && payload.employee.role !== Role.MANAGER) {
          invalid = true;
          break;
        }

        if (timeEntry.employeeId) {
          timeEntriesCreate.push({
            projectId: timeEntry.projectId,
            date: timeEntry.date,
            employeeId: timeEntry.employeeId,
            hours: timeEntry.hours ? timeEntry.hours : 0,
          });
        } else
          timeEntriesCreate.push({
            projectId: timeEntry.projectId,

            date: timeEntry.date,
            employeeId: payload.sub,
            hours: timeEntry.hours ? timeEntry.hours : 0,
          });
      }
    }
    console.log(countLeave);

    if (invalid)
      return {
        data: null,
        message: 'Limit exceeded',
        status: 400,
      };
    const [resultUpdate, resultCreate] = await Promise.all([
      this.timeEntryService.updateMany(timeEntriesUpdate),
      this.timeEntryService.createMany(timeEntriesCreate),
    ]);

    return [...resultUpdate, ...resultCreate];
  }

  @Get('/employee/time-entries/:id?')
  @Message.Success({
    message: `${capitalize('time-entry')} found`,
    status: 201,
  })
  @Message.Error({
    message: `${capitalize('time-entry')} not found`,
    status: 201,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    required: false,
  })
  getTimeEntriesEmployee(
    @Authorizer() payload: { sub: string; employee: Employee },
    @Param('id') id?: string,
  ) {
    if (id) {
      return this.timeEntryService.findMany({
        employeeId: id,
      });
    } else
      return this.timeEntryService.findMany({
        employeeId: payload.sub,
      });
  }

  @Get('/employee/projects')
  @Message.Success({
    message: `${capitalize('project')} found`,
    status: 201,
  })
  @ApiBearerAuth('JWT-auth')
  getProjectsEmployee(
    @Authorizer() payload: { sub: string; employee: Employee },
  ) {
    return this.projectService.getProjectsByEmployeeId(payload.sub);
  }

  @Get('/employee/role')
  @Message.Success({
    message: `${capitalize('role')} found`,
    status: 201,
  })
  @ApiBearerAuth('JWT-auth')
  getEmployee(@Authorizer() payload: { sub: string; employee: Employee }) {
    return payload.employee;
  }
  @Get('/employee/project/:id?')
  @Message.Success({
    message: `${capitalize('project')} found`,
    status: 201,
  })
  @ApiParam({
    name: 'year',
    required: false,
  })
  @ApiBearerAuth('JWT-auth')
  getProjectsEmployeeWithYear(
    @Authorizer() payload: { sub: string; employee: Employee },
    @Param('id') id?: string,
    @Query('year') year?: number,
  ) {
    const dnow = new Date();
    if (id) {
      return this.projectService.getProjectsByEmployeeIdWithYear(
        id,
        year || dnow.getFullYear(),
      );
    } else if (year) {
      return this.projectService.getProjectsByEmployeeIdWithYear(
        payload.sub,
        year || dnow.getFullYear(),
      );
    }
  }
}
