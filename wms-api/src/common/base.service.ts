import { IRepository, IService, PaginateDto, PaginatedResult } from './types';

export default abstract class Service<
  T = unknown,
  TFilter = unknown,
  TCreate = unknown,
  TUpdate = unknown,
> implements IService<T, TFilter, TCreate, TUpdate>
{
  protected _repository: IRepository<T, TFilter, TCreate, TUpdate>;

  findOneById(id: string): Promise<T> {
    return this._repository.findOneById(id);
  }
  findOne(filter: Partial<TFilter>): Promise<T> {
    return this._repository.findOne(filter);
  }
  findMany(filter: Partial<TFilter>): Promise<T[]> {
    return this._repository.findMany(filter);
  }
  update(id: string, item: Partial<TUpdate>): Promise<T> {
    return this._repository.update(id, item);
  }
  create(item: Partial<TCreate>): Promise<T> {
    return this._repository.create(item);
  }
  delete(id: string): Promise<T> {
    return this._repository.delete(id);
  }
  remove(id: string): Promise<T> {
    return this._repository.remove(id);
  }

  findPaginate(
    filter: Partial<TFilter>,
    paginate: PaginateDto,
  ): Promise<PaginatedResult<T>> {
    return this._repository.findPaginate(filter, paginate);
  }
}
