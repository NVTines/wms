import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): any {
    this.logger.error(
      'PrismaExceptionFilter',
      exception,
      `${exception.code} - ${exception?.meta?.modelName} - ${exception?.meta?.cause} `,
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(400).json({
      status: 400,
      data: null,
      message: 'Error occurred while requesting, please try again later.',
    });
    // switch (exception.code) {
    //   case 'P2002': {
    //     throw new ConflictException(
    //       `${exception?.meta?.modelName || 'Entity'} already exist`,
    //     );
    //   }
    //   case 'P2003': {
    //     throw new UnprocessableEntityException(`Entity Not Exist`);
    //   }
    //   case 'P2023': {
    //     throw new BadRequestException(`ID is invalid`);
    //   }
    //   case 'P2025': {
    //     // console.log(exception);
    //     throw new NotFoundException(`Error occurred while fetching `);
    //   }
    //   default:
    //     throw new NotFoundException(
    //       `Unknown error occurred. Please try again later`,
    //     );
    // }
    // return exception;
  }
}
