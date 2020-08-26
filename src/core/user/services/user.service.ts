import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { FindUserArgs, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private repository: typeof User) {}

  async update(findArgs: FindUserArgs, updateDto: UpdateUserDto) {
    const paranoid = findArgs.paranoid;
    delete findArgs.paranoid;
    const user = await this.repository
      .findByPk(findArgs.id, { paranoid, rejectOnEmpty: true });
    return user.update(updateDto);
  }

  async clearAll(user: User) {
    const updateUserDto: UpdateUserDto = {
      universityId: null,
      studyPeriodId: null,
      studyProgramId: null,
      courseId: null,
      activityTypeId: null
    };
    return user.update(updateUserDto);
  }


}