import { Test, TestingModule } from '@nestjs/testing';
import { UserAccountResolver } from './user-account.resolver';

describe('UserAccountResolver', () => {
  let resolver: UserAccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAccountResolver],
    }).compile();

    resolver = module.get<UserAccountResolver>(UserAccountResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
