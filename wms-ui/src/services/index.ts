export interface Response<T> {
  status: number;
  message: string | null;
  data: T | null;
}
export interface Paginate {
  page?: number;
  perPage?: number;
  limit?: number;
}
export interface PayloadPaginate {
  body?: Record<string, any>;
  paginate?: Paginate;
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

export * from './employee';
export * from './auth';
export * from './timeEntry';
export * from './project';
