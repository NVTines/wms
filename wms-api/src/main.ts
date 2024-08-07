import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import os from 'os';
import express from 'express';
import { AppModule } from '@/app.module';
import { PrismaExceptionFilter } from './common/exceptions/PrismaExceptionFilter';

import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/exceptions/HttpExceptionFilter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

const swagger = (app: NestExpressApplication) => {
  console.log(process.env.DATABASE_URL);
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation WMS')
      .setDescription('Version API')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .setVersion('1.0')
      .build();
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('/api/:version?/docs', app, document, {
      patchDocumentOnRequest: (req, _res, document) => {
        const copyDocument = JSON.parse(JSON.stringify(document));

        const version = (req as any).params.version;
        if (version === undefined) {
          return copyDocument;
        }

        const isValidVersion = /^v(\d+\.)?(\d+\.)?(\*|\d+)$/;

        if (!version || !isValidVersion.test(version)) {
          return copyDocument;
        }
        document.info.version = version.replace('v', '');
        for (const route in document.paths) {
          if (route.startsWith(`/api/${version}`)) {
            continue;
          }
          delete copyDocument.paths[route];
        }

        return copyDocument;
      },
    });
  }
};

const actionGlobal = (app: NestExpressApplication) => {
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter(), new HttpExceptionFilter());
};

const security = (app: NestExpressApplication) => {
  app.enableCors({
    origin: '*',
    credentials: true,
  });
};

const configApi = (app: NestExpressApplication) => {
  app.use(compression());

  app.use(express.json({ limit: '200mb' }));
  app.use(express.urlencoded({ limit: '200mb', extended: true }));
  app.use(express.text({ limit: '200mb' }));
  app.use(express.raw({ limit: '200mb' }));
  app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1.0',
  });
};
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const cpus = os.cpus().length;
  process.env.UV_THREADPOOL_SIZE = cpus.toString();

  actionGlobal(app);
  security(app);
  configApi(app);
  Logger.log(`Server running on http://localhost:8334`, 'Bootstrap');
  await app.listen(process.env.PORT || 8334);
}
bootstrap();
