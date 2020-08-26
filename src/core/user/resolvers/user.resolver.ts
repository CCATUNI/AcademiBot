import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { DeleteUserArgs, FindUserArgs, FindUsersArgs, RestoreUserArgs, UpdateUserDto } from '../dto/user.dto';
import { QueryFields } from '../../../common/decorators/query-fields.decorator';
import { QueryIncludes } from '../../../common/decorators/query-includes.decorator';
import { UserAccount } from '../models/user-account.model';
import { Course } from '../../university/models/course.model';
import { UPDATE_MUTATION_INPUT } from '../../../config/constants';
import { UserService } from '../services/user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(
    @InjectModel(User) private repository: typeof User,
    private userService: UserService
  ) {}

  @Query(returns => User)
  user(
    @Args() findArgs: FindUserArgs,
    @QueryFields(User) attributes: string[],
    @QueryIncludes(['accounts', 'course']) includes: boolean[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;

    const include = [UserAccount, Course].filter((v, i) => includes[i]);
    return this.repository.findByPk(findArgs.id, { attributes, include, paranoid });
  }

  @Query(returns => [User])
  users(
    @Args() findArgs: FindUsersArgs,
    @QueryFields(User) attributes: string[],
    @QueryIncludes(['accounts', 'course']) includes: boolean[]
  ) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const include = [UserAccount, Course].filter((v, i) => includes[i]);
    return this.repository
      .findAll({ where: {...findArgs}, attributes, include, paranoid });
  }

  @ResolveField(returns => [UserAccount])
  accounts(
    @Parent() parent: User,
    @QueryFields(UserAccount) attributes: string[]
  ) {
    if (parent.userAccounts) return parent.userAccounts;
    return parent.getUserAccounts({ attributes });
  }

  @ResolveField(returns => [Course])
  course(
    @Parent() parent: User,
    @QueryFields(Course) attributes: string[]
  ) {
    if (parent.course) return parent.course;
    return parent.getCourse({ attributes });
  }

  @Mutation(returns => User)
  createUser() {
    return this.repository.create();
  }

  @Mutation(returns => User)
  async updateUser(
    @Args() findArgs: FindUserArgs,
    @Args(UPDATE_MUTATION_INPUT) updateDto: UpdateUserDto
  ) {
    return this.userService.update(findArgs, updateDto);
  }

  @Mutation(returns => User)
  async deleteUser(@Args() deleteArgs: DeleteUserArgs) {
    const user = await this.repository
      .findByPk(deleteArgs.id, { rejectOnEmpty: true });
    await user.destroy();
    return user;
  }

  @Mutation(returns => User)
  async restoreUser(@Args() restoreArgs: RestoreUserArgs) {
    const user = await this.repository
      .findByPk(restoreArgs.id, { rejectOnEmpty: true, paranoid: false });
    await user.restore();
  }
}
