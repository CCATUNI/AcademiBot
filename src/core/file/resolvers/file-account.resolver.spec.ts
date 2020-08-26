import { Test, TestingModule } from '@nestjs/testing';
import { FileAccountResolver } from './file-account.resolver';

describe('FileAccountResolver', () => {
  let resolver: FileAccountResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileAccountResolver],
    }).compile();

    resolver = module.get<FileAccountResolver>(FileAccountResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
