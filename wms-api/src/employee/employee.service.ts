import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import Service from '@/common/base.service';
import { Employee } from '@/.gen/prisma-class/employee';
import { CreateEmployeeDto } from '@/.gen/dto/create-employee.dto';
import { EmployeeDto } from '@/.gen/dto/employee.dto';
import { UpdateEmployeeDto } from '@/.gen/dto/update-employee.dto';
@Injectable()
export class EmployeeService extends Service<
  Employee,
  EmployeeDto,
  CreateEmployeeDto,
  UpdateEmployeeDto
> {
  constructor(private readonly employeeRepository: EmployeeRepository) {
    super();
    this._repository = employeeRepository;
  }
}
