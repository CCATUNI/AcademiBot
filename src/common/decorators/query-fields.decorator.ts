import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { ArgsOptions } from '@nestjs/graphql';
import { Model } from 'sequelize-typescript';
import { intersect } from '../helpers/intersect';
import { FieldNode } from 'graphql/language/ast';

// Gives all the values queried + the primary keys of the model (in the case of eager loading needed)
export const QueryFields = createParamDecorator((data: typeof Model, opts: ExecutionContext) => {
  const args = opts.getArgs<[any, ArgsOptions, Request, GraphQLResolveInfo]>()
  const info = args[3];
  const names = info.fieldNodes.map(findNamesRecursive).flat();
  const modelAttributes = Object.getOwnPropertyNames(data.rawAttributes);
  const intersection = names.filter(v => modelAttributes.includes(v));
  return Array.from(
    (new Set(intersection.concat(data.primaryKeyAttributes)).values())
  );
})

function findNamesRecursive(node: FieldNode): string[] {
  if (!node.selectionSet) {
    return [node.name.value];
  }
  return [node.name.value].concat(...node.selectionSet.selections.map(findNamesRecursive));
}