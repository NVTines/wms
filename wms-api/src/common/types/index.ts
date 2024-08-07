import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';

export type Action = {
  [K in Prisma.PrismaAction]: (...args: any[]) => any;
};

export interface IController<
  T,
  TFilter = unknown,
  TCreate = unknown,
  TUpdate = unknown,
> {
  findOneById(id: string): Promise<T>;
  findOne(filter: Partial<TFilter>): Promise<T>;
  findMany(filter: Partial<TFilter>): Promise<T[]>;

  update(id: string, item: Partial<TUpdate>): Promise<T>;
  create(item: Partial<TCreate>): Promise<T>;
  delete(id: string): Promise<T>;
  remove(id: string): Promise<T>;
}

export interface IRepository<
  T,
  TFilter = unknown,
  TCreate = unknown,
  TUpdate = unknown,
> {
  findOneById(id: string): Promise<T>;
  findOne(filter: Partial<TFilter>): Promise<T>;
  findMany(filter: Partial<TFilter>): Promise<T[]>;
  findPaginate(
    filter: Partial<TFilter>,
    paginate: PaginateDto,
  ): Promise<PaginatedResult<T>>;

  update(id: string, item: Partial<TUpdate>): Promise<T>;
  create(item: Partial<TCreate>): Promise<T>;
  delete(id: string): Promise<T>;
  remove(id: string): Promise<T>;
  count(filter: Partial<TFilter>): Promise<number>;
  isExist(id: string): boolean;
}

export interface IService<
  T,
  TFilter = unknown,
  TCreate = unknown,
  TUpdate = unknown,
> {
  findOneById(id: string): Promise<T>;
  findOne(filter: Partial<TFilter>): Promise<T>;
  findMany(filter: Partial<TFilter>): Promise<T[]>;
  findPaginate(
    filter: Partial<TFilter>,
    paginate: PaginateDto,
  ): Promise<PaginatedResult<T>>;
  update(id: string, item: Partial<TUpdate>): Promise<T>;
  create(item: Partial<TCreate>): Promise<T>;
  delete(id: string): Promise<T>;
  remove(id: string): Promise<T>;
}

export class PaginateDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  page?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  limit?: number;

  @ApiPropertyOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  perPage?: number;
}

export interface PaginatedResult<T> {
  result: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;
