import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Type,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IController, IService, PaginateDto, PaginatedResult } from './types';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Message } from './decorators/message.decorator';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

export function BaseController<
  T,
  TFilter = unknown,
  TCreate = unknown,
  TUpdate = unknown,
>(
  refEntity: Type<T>,
  refFilterDto: Type<TFilter>,
  refCreateDto: Type<TCreate>,
  refUpdateDto: Type<TUpdate>,
  _name?: string,
  isAuth: boolean = false,
): any {
  const name = _name || refEntity.name.toUpperCase();
  const endpointPlural = pluralize(name, 2, false).toLowerCase();
  const endpoint = pluralize(name, 1, false).toLowerCase();
  
  if (!isAuth) {
    @ApiTags(name.toUpperCase())
    abstract class Controller implements IController<T> {
      constructor(private _service: IService<T, TFilter, TCreate, TUpdate>) {}
      @Get(`/${endpoint}/:id`)
      @Message.Success({ message: `${capitalize(name)} found`, status: 201 })
      @Message.Error({ message: `${capitalize(name)} not found`, status: 404 })
      findOneById(@Param('id') id: string): any {
        return this._service.findOneById(id);
      }

      @Get(`/${endpoint}`)
      @ApiQuery({ name: 'filter', required: false, type: refFilterDto })
      @UsePipes()
      @Message.Success({ message: `${capitalize(name)} found`, status: 201 })
      @Message.Error({ message: `${capitalize(name)} not found`, status: 201 })
      findOne(
        @Query(
          new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
          }),
        )
        filter: Partial<TFilter>,
      ): Promise<T> {
        return this._service.findOne(filter);
      }
      @Get(`/${endpointPlural}`)
      @ApiQuery({ name: 'filter', required: true, type: refFilterDto })
      @Message.Success({ message: `${capitalize(name)} found`, status: 201 })
      @Message.Error({
        message: `An error occurred while fetching, please try again!`,
        status: 404,
      })
      findMany(@Query() filter: Partial<TFilter>): Promise<T[]> {
        return this._service.findMany(filter);
      }

      @Post(`/paginate/${endpointPlural}`)
      @Message.Success({ message: `${capitalize(name)} found`, status: 201 })
      @Message.Error({
        message: `An error occurred while fetching, please try again!`,
        status: 404,
      })
      @ApiBody({ required: false, type: refFilterDto })
      findPaginate(
        @Query() paginate: PaginateDto,
        @Body() filter: Partial<TFilter>,
      ): Promise<PaginatedResult<T>> {
        return this._service.findPaginate(filter, paginate);
      }
      @Post(`/${endpoint}`)
      @ApiBody({ required: true, type: refCreateDto })
      @Message.Success({
        message: `${capitalize(name)} was created!`,
        status: 201,
      })
      @Message.Error({
        message: `An error occurred while creating, please try again!`,
        status: 404,
      })
      create(@Body() item: Partial<TCreate>): Promise<T> {
        return this._service.create(item);
      }
      @Delete(`/${endpoint}/delete/:id`)
      @Message.Success({
        message: `${capitalize(name)} was deleted!`,
        status: 201,
      })
      @Message.Error({
        message: `An error occurred while deleting, please try again!`,
        status: 404,
      })
      delete(@Param('id') id: string): Promise<T> {
        return this._service.delete(id);
      }

      @Delete(`/${endpoint}/remove/:id`)
      @Message.Success({
        message: `${capitalize(name)} was removed!`,
        status: 201,
      })
      @Message.Error({
        message: `An error occurred while removing, please try again!`,
        status: 404,
      })
      remove(@Param('id') id: string): Promise<T> {
        return this._service.remove(id);
      }
      
      @Put(`/${endpoint}/:id`)
      @ApiBody({ required: true, type: refUpdateDto })
      @Message.Success({
        message: `${capitalize(name)} was updated!`,
        status: 201,
      })
      @Message.Error({
        message: `An error occurred while updating, please try again!`,
        status: 404,
      })
      update(
        @Param('id') id: string,
        @Body() item: Partial<TUpdate>,
      ): Promise<T> {
        return this._service.update(id, item);
      }
    }
    return Controller;
  } else {
    @ApiTags(name.toUpperCase())
    abstract class ControllerWithAuth implements IController<T> {
      constructor(private _service: IService<T, TFilter, TCreate, TUpdate>) {}
      @Get(`/${endpoint}/:id`)
      @Message.Success({ message: `${capitalize(name)} found`, status: 201 })
      @Message.Error({ message: `${capitalize(name)} not found`, status: 404 })
      @ApiBearerAuth('JWT-auth')
      findOneById(@Param('id') id: string): any {
        return this._service.findOneById(id);
      }

      @Post(`/paginate/${endpointPlural}`)
      @Message.Success({ message: `${capitalize(name)} found`, status: 201 })
      @Message.Error({
        message: `An error occurred while fetching, please try again!`,
        status: 404,
      })
      @ApiBody({ required: false, type: refFilterDto })
      @ApiBearerAuth('JWT-auth')
      findPaginate(
        @Query() paginate: PaginateDto,
        @Body() filter: Partial<TFilter>,
      ): Promise<PaginatedResult<T>> {
        return this._service.findPaginate(filter, paginate);
      }

      @Get(`/${endpoint}`)
      @ApiQuery({ name: 'filter', required: false, type: refFilterDto })
      @Message.Success({ message: `${capitalize(name)} found`, status: 201 })
      @Message.Error({ message: `${capitalize(name)} not found`, status: 201 })
      @ApiBearerAuth('JWT-auth')
      findOne(@Query() filter: Partial<TFilter>): Promise<T> {
        return this._service.findOne(filter);
      }

      @Get(`/${endpointPlural}`)
      @ApiQuery({ name: 'filter', required: true, type: refFilterDto })
      @Message.Success({ message: `${capitalize(name)} found`, status: 201 })
      @Message.Error({
        message: `An error occurred while fetching, please try again!`,
        status: 404,
      })
      @ApiBearerAuth('JWT-auth')
      findMany(@Query() filter: Partial<TFilter>): Promise<T[]> {
        return this._service.findMany(filter);
      }

      @Post(`/${endpoint}`)
      @ApiBody({ required: true, type: refCreateDto })
      @Message.Success({
        message: `${capitalize(name)} was created!`,
        status: 201,
      })
      @ApiBearerAuth('JWT-auth')
      @Message.Error({
        message: `An error occurred while creating, please try again!`,
        status: 404,
      })
      async create(@Body() item: Partial<TCreate>): Promise<T> {
        console.log(item);
        const x = await this._service.create(item);
        console.log(x);
        return x;
      }

      @Delete(`/${endpoint}/delete/:id`)
      @Message.Success({
        message: `${capitalize(name)} was deleted!`,
        status: 201,
      })
      @ApiBearerAuth('JWT-auth')
      @Message.Error({
        message: `An error occurred while deleting, please try again!`,
        status: 404,
      })
      delete(@Param('id') id: string): Promise<T> {
        return this._service.delete(id);
      }

      @Delete(`/${endpoint}/remove/:id`)
      @Message.Success({
        message: `${capitalize(name)} was removed!`,
        status: 201,
      })
      @ApiBearerAuth('JWT-auth')
      @Message.Error({
        message: `An error occurred while removing, please try again!`,
        status: 404,
      })
      remove(@Param('id') id: string): Promise<T> {
        return this._service.remove(id);
      }
      
      @Put(`/${endpoint}/:id`)
      @ApiBody({ required: true, type: refUpdateDto })
      @Message.Success({
        message: `${capitalize(name)} was updated!`,
        status: 201,
      })
      @Message.Error({
        message: `An error occurred while updating, please try again!`,
        status: 404,
      })
      @ApiBearerAuth('JWT-auth')
      update(
        @Param('id') id: string,
        @Body() item: Partial<TUpdate>,
      ): Promise<T> {
        return this._service.update(id, item);
      }
    }
    return ControllerWithAuth;
  }
}
