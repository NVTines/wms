import { Action, IRepository, PaginateDto, PaginatedResult } from './types';

export default abstract class Repository<T, TFilter, TCreate, TUpdate>
  implements IRepository<T, TFilter, TCreate, TUpdate>
{
  protected constructor(
    private _model: Action,
    private readonly options: Record<string, any>,
    private readonly map?: (values: any) => T,
  ) {}
  async findOneById(id: string): Promise<T> {
    return this._model.findUnique({ where: { id }, ...this.options });
  }

  findOne(filter: Partial<TFilter>): Promise<T> {
    return this._model.findFirst({ where: filter, ...this.options });
  }
  findMany(filter: Partial<TFilter>): Promise<T[]> {
    return this._model.findMany({ where: filter, ...this.options });
  }

  async update(id: string, updateData: Partial<TUpdate>): Promise<T> {
    try {
      const filteredData = { ...updateData };
      if ('timeEntries' in filteredData) {
        delete filteredData.timeEntries;
      }
      const updatedItem = await this._model.update({
        where: { id },
        data: filteredData,
      });
  
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async findPaginate(
    filter: Partial<TFilter>,
    paginate: PaginateDto,
  ): Promise<PaginatedResult<T>> {
    const page = Number(paginate?.page || 1) || 1;
    const perPage = Number(paginate?.perPage || 10) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, data] = await Promise.all([
      this._model.count({ where: filter || {} }),
      this._model.findMany({
        where: filter || {},
        take: perPage,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);

    return {
      result: data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  }

  create(item: Partial<TCreate>): Promise<T> {
    if (this.map !== undefined) {
      return this._model.create({ data: this.map(item) });
    }
    return this._model.create({ data: item });
  }
  delete(id: string): Promise<T> {
    return this._model.update({ where: { id }, data: { deletedAt: true } });
  }
  remove(id: string): Promise<T> {
    return this._model.delete({ where: { id } });
  }
  async count(filter: Partial<TFilter>): Promise<number> {
    return this._model
      .findMany({ where: filter })
      .then((items: T[]) => items.length);
  }
  isExist(id: string): boolean {
    return !!this._model.findUnique({ where: { id } });
  }
}
