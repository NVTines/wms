import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      // console.log(params);

      if (
        (params.action == 'create' || params.action.startsWith('update')) &&
        params.model == 'Employee'
      ) {
        const employee = params.args.data;
        // console.log(employee);

        const hash = bcrypt.hashSync(employee.password, 10);
        employee.password = hash;
        params.args.data = employee;
      }
      return next(params);
    });
  }
  onModuleDestroy() {
    this.$disconnect();
  }
}
