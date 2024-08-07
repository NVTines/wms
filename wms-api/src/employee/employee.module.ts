import { Module } from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';
import { PrismaModule } from '@/common/prisma/prisma.module';
import Service from '@/common/base.service';
import { Employee, Project } from '@/.gen/dto';
import { TimeEntryModule } from '@/time-entry';
import { ProjectModule, ProjectService } from '@/project';

@Module({
  imports: [PrismaModule, TimeEntryModule, ProjectModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    {
      provide: Service<Employee>,
      useClass: EmployeeService,
    },
    EmployeeRepository,
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
