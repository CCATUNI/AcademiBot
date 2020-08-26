import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { ArgsOptions } from '@nestjs/graphql';
import { Model } from 'sequelize-typescript';
import { intersect } from '../helpers/intersect';

// Gives all the values queried + the primary keys of the model (in the case of eager loading needed)
export const QueryFields = createParamDecorator((data: typeof Model, opts: ExecutionContext) => {
  const args = opts.getArgs<[any, ArgsOptions, Request, GraphQLResolveInfo]>()
  const info = args[3];
  const fields: {[field: string]: string[]} = {};
  info.fieldNodes.forEach(v => {
    fields[v.name.value] = v.selectionSet.selections.map(v => (v as any).name.value) as string[];
  })
  const result = intersect(fields[info.fieldName], Reflect.ownKeys(data.prototype));
  return Array.from((new Set(result.concat(data.primaryKeyAttributes))).values());
})