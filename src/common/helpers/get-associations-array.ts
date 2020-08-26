import { Model } from 'sequelize-typescript';
import { intersect } from './intersect';

export function getAssociationsArray<T>(model: typeof Model, fields: string[]) {
  const props = Reflect.ownKeys(model.prototype);
  const modelAssociations = Object.getOwnPropertyNames(model.associations);
  const associationsQueried =  intersect(props, fields);
  console.log(props, associationsQueried);
}