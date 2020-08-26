import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { File } from '../../core/file/models/file.model';
import { LoadStudyMaterialService } from './load-study-material.service';

@ObjectType()
class Obj {
  @Field()
  success: true;
}

@Resolver('LoadStudyMaterial')
export class LoadStudyMaterialResolver {
  constructor(private loaderService: LoadStudyMaterialService) {}

  @Mutation(returns => File)
  loadStudyMaterial(@Args('url') url: string, @Args('prefix') key: string) {
    return this.loaderService.loadOne(url, key);
  }

  @Mutation(returns => Obj)
  loadStudyMaterials(@Args('path') path: string, @Args('prefix') key: string) {
    return this.loaderService.loadMany(path, key);
  }


}
