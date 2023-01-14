import { ApiPerson, ApiProduct, ApiStore } from 'api';
import { PersonOption, ProductOption, StoreOption } from '../types';

export const mapStoreToOption = (store: ApiStore): StoreOption => ({
  label: store.name,
  data: store,
});

export const mapProductToOption = (product: ApiProduct): ProductOption => ({
  label: product.name,
  data: product,
});

export const mapPersonToOption = (person: ApiPerson): PersonOption => ({
  label: person.firstName,
  data: person,
});
