import { Test, TestingModule } from '@nestjs/testing';
import { FileSyncService } from './file-sync.service';

describe('FileSyncService', () => {
  let service: FileSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSyncService],
    }).compile();

    service = module.get<FileSyncService>(FileSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
