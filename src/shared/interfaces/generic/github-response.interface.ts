import { Pagination } from './generic-response.interface';

export interface GithubData<T> {
  results: T;
  pagination: Pagination;
}
