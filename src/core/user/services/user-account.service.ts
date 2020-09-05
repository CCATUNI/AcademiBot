import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserAccount } from '../models/user-account.model';
import { User } from '../models/user.model';
import { CreateUserAccountDto, FindUserAccountArgs, FindUserAccounts } from '../dto/user-account.dto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectModel(UserAccount) private accountRepository: typeof UserAccount,
    @InjectModel(User) private userRepository: typeof User,
    private sequelize: Sequelize
  ) {}

  async findOne(findArgs: FindUserAccountArgs) {
    delete findArgs.paranoid;
    return this.accountRepository
      .findOne({ where: {...findArgs}, include: [User] });
  }

  async create(createDto: CreateUserAccountDto) {
    return this.sequelize.transaction(async transaction => {
      if (!createDto.userId) {
        const user = await this.userRepository.create({}, { transaction });
        createDto.userId = user.id;
      }
      return this.accountRepository.create(createDto, { transaction });
    });
  }

  async findAllForUpdate(findArgs: FindUserAccounts) {
    return this.accountRepository
      .findAll({ where: {...findArgs, publicInformation: null }});
  }

  async findAdmins() {
    return this.accountRepository
      .findAll({ where: { privileges: {[Op.gt]: 0} } } );
  }

  createAccountFinder(platformId: string) {
    return (identifierInPlatform: string) => {
      const where = { platformId, identifierInPlatform };
      return this.accountRepository
        .findOne({ where, include: [User] });
    }
  }
}