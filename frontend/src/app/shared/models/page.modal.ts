export interface PageProperties {
  empty: boolean;
  number: number;
  totalElements: number;
}

export interface Response<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {};
  size: number;
  sort: {};
  totalElements: number;
  totalPages: number;
  password: string;
}
