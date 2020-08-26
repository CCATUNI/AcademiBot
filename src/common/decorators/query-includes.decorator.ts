import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ArgsOptions } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { FieldNode } from 'graphql/language/ast';

export const QueryIncludes = createParamDecorator((data: string[], opts: ExecutionContext) => {
  const args = opts.getArgs<[any, ArgsOptions, Request, GraphQLResolveInfo]>()
  const info = args[3];
  return data.map(v => {
    let includes = false;
    info.fieldNodes.forEach(v2 => {
      if (includes) return;
      v2.selectionSet.selections.forEach(v3 => {
        if (includes) return;
        if ((v3 as FieldNode).name.value === v) includes = true;

      })
    });
    return includes;
  });
})