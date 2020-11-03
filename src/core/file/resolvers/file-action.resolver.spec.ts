import { Test, TestingModule } from '@nestjs/testing';
import { FileActionResolver } from './file-action.resolver';

describe('FileActionResolver', () => {
  let resolver: FileActionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileActionResolver],
    }).compile();

    resolver = module.get<FileActionResolver>(FileActionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
