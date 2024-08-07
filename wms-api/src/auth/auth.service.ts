import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AuthDto, RefreshDto } from './auth.dto';
import { EmployeeRepository, EmployeeService } from '@/employee';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}

  async authorize(credentials: AuthDto) {
    this.logger.log(`Authorizing employee ${JSON.stringify(credentials)}`);

    const employee = await this.employeeService.findOne({
      code: credentials.code,
    });
    console.log(employee);

    if (employee) {
      try {
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          employee.password,
        );
        if (isPasswordValid) {
          const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
              {
                sub: employee.id,
                employee,
              },
              {
                // expiresIn: '15s',
                expiresIn: '10000000d',
              },
            ),
            this.jwtService.signAsync(
              {
                sub: employee.id,
                employee,
              },
              {
                expiresIn: '7d',
              },
            ),
          ]);
          return {
            accessToken,
            refreshToken,
          };
        } else {
          this.logger.log('Invalid password');
          return null;
        }
      } catch (error) {
        this.logger.log(`Error authorizing employee: ${error.message}`);
      }
    }
    this.logger.log(`Employee: ${JSON.stringify(employee)}`);
  }
  async refresh(credentials: RefreshDto) {
    const { accessToken, refreshToken } = credentials;

    try {
      const payload = this.jwtService.verify(refreshToken);
      if (payload) {
        const employee = await this.employeeService.findOne({
          id: payload.sub,
        });
        const accessToken = this.jwtService.sign(
          {
            sub: employee.id,
            employee,
          },
          {
            expiresIn: '10000000d',
            // expiresIn: '15s',
          },
        );

        return {
          accessToken,
        };
      } else {
        return null;
      }
    } catch (error) {
      this.logger.log(error);
      throw new HttpException('Unauthorized', 401);
    }
  }
}
