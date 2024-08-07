import { Inject, Injectable } from '@nestjs/common';

import BaseRepository from '@/common/base.repository';

import { PrismaService } from '@/common/prisma/prisma.service';
import { Employee } from '@/.gen/prisma-class/employee';
import { CreateEmployeeDto } from '@/.gen/dto/create-employee.dto';
import { EmployeeDto } from '@/.gen/dto/employee.dto';
import { UpdateEmployeeDto } from '@/.gen/dto/update-employee.dto';
import { Action } from '@/common/types';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class EmployeeRepository extends BaseRepository<
  Employee,
  EmployeeDto,
  CreateEmployeeDto,
  UpdateEmployeeDto
> {
  constructor(@Inject(PrismaService) private prisma: PrismaClient) {
    super(prisma.employee as unknown as Action, {
      include: {},
    });
  }
}
