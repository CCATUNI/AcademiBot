import { Test, TestingModule } from '@nestjs/testing';
import { UserAccountSyncService } from './user-account-sync.service';

describe('UserAccountSyncService', () => {
  let service: UserAccountSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAccountSyncService],
    }).compile();

    service = module.get<UserAccountSyncService>(UserAccountSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
