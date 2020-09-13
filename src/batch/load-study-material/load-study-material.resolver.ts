import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { File } from '../../core/file/models/file.model';
import { LoadStudyMaterialService } from './load-study-material.service';


@Resolver('LoadStudyMaterial')
export class LoadStudyMaterialResolver {
  constructor(private loaderService: LoadStudyMaterialService) {}

  @Mutation(returns => File)
  loadStudyMaterial(@Args('url') url: string, @Args('prefix') prefix: string) {
    return this.loaderService.loadOne(url, prefix);
  }

}
