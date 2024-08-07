import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { EmployeeModule, EmployeeRepository } from '@/employee';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EmployeeModule,
    JwtModule.register({
      global: true,
      secret: 'abcdxyz',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmployeeRepository],
  exports: [AuthService],
})
export class AuthModule {}
