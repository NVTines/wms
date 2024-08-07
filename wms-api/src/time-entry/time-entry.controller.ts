import { BaseController } from '@/common/base.controller';
import {
  Controller,
  Get,
  Query,
  Type,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import Service from '@/common/base.service';
import {
  CreateTimeEntryProjectDto,
  UpdateTimeEntryProjectDto,
  TimeEntryProject as TimeEntryProjectDto,
  Employee,
} from '@/.gen/dto';
import { TimeEntryProject } from '@/.gen/prisma-class/time_entry_project';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';
import { capitalize } from 'lodash';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { Authorizer } from '@/auth/decorators/authenticator.decorator';

@Controller()
@UseGuards(AuthGuard)
export class TimeEntryController extends BaseController<
  TimeEntryProject,
  unknown,
  unknown,
  unknown
>(
  TimeEntryProject,
  TimeEntryProjectDto,
  CreateTimeEntryProjectDto,
  UpdateTimeEntryProjectDto,
  'time-entry',
) {
  constructor(private readonly timeEntryService: Service<TimeEntryProject>) {
    super(timeEntryService);
  }

  @Get(`/time-entry`)
  @ApiQuery({ name: 'filter', required: false, type: TimeEntryProjectDto })
  @Message.Success({
    message: `${capitalize('time-entry')} found`,
    status: 201,
  })
  @Message.Error({
    message: `${capitalize('time-entry')} not found`,
    status: 201,
  })
  @ApiBearerAuth('JWT-auth')
  findOne(
    @Query() filter: Partial<TimeEntryProjectDto>,
  ): Promise<TimeEntryProject> {
    filter = {
      ...filter,
      hours: +filter.hours!,
    };
    return this._service.findOne(filter);
  }
}
