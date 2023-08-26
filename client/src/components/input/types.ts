import { ApiPerson, ApiProduct, ApiStore } from '../../api';

export interface Option<T> {
  label: string;
  data: T;
}

export type StoreOption = Option<ApiStore>;

export type ProductOption = Option<ApiProduct>;

export type PersonOption = Option<ApiPerson>;
