import { Module } from '@nestjs/common';

import { TimeEntryService } from './time-entry.service';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryRepository } from './time-entry.repository';
import { PrismaModule } from '@/common/prisma/prisma.module';
import Service from '@/common/base.service';
import { TimeEntryProject } from '@/.gen/dto';

@Module({
  imports: [PrismaModule],
  controllers: [TimeEntryController],
  providers: [
    TimeEntryService,
    TimeEntryRepository,
    {
      provide: Service<TimeEntryProject>,
      useClass: TimeEntryService,
    },
  ],
  exports: [TimeEntryService, TimeEntryRepository],
})
export class TimeEntryModule {}
