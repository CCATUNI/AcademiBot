import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FieldNode, GraphQLResolveInfo } from 'graphql';
import { ArgsOptions } from '@nestjs/graphql';

export const QueryAssociation = createParamDecorator((data, opts: ExecutionContext) => {
  const args = opts.getArgs<[any, ArgsOptions, Request, GraphQLResolveInfo]>()
  const info = args[3];
  let hasAssociation = false;
  info.fieldNodes.forEach(v => {
    v.selectionSet.selections.forEach((v1: FieldNode) => {
      if (v1.selectionSet) {
        hasAssociation = true;
      }
    })
  })
  return hasAssociation;
})