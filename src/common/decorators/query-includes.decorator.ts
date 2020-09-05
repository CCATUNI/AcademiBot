import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ArgsOptions } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { FieldNode } from 'graphql/language/ast';

export const QueryIncludes = createParamDecorator((data: string[], opts: ExecutionContext) => {
  const args = opts.getArgs<[any, ArgsOptions, Request, GraphQLResolveInfo]>()
  const info = args[3];
  const names = info.fieldNodes.map(findNamesRecursive).flat();
  return data.map(v => names.includes(v));
})

function findNamesRecursive(node: FieldNode): string[] {
  if (!node.selectionSet) {
    return [node.name.value];
  }
  return [node.name.value].concat(...node.selectionSet.selections.map(findNamesRecursive));
}