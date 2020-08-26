import { Test, TestingModule } from '@nestjs/testing';
import { FileRequestResolver } from './file-request.resolver';

describe('FileRequestResolver', () => {
  let resolver: FileRequestResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileRequestResolver],
    }).compile();

    resolver = module.get<FileRequestResolver>(FileRequestResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
