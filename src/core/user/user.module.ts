import { Module } from '@nestjs/common';
import { UserResolver } from './resolvers/user.resolver';
import { UserAccountResolver } from './resolvers/user-account.resolver';
import { SessionResolver } from './resolvers/session.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserAccount } from './models/user-account.model';
import { Session } from './models/session.model';
import { UserService } from './services/user.service';
import { UserAccountService } from './services/user-account.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      UserAccount,
      Session
    ])
  ],
  providers: [
    UserResolver,
    UserAccountResolver,
    SessionResolver,
    UserService,
    UserAccountService
  ],
  exports: [SequelizeModule, UserAccountService, UserService]
})
export class UserModule {}
