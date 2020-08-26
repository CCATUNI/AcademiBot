import { Test, TestingModule } from '@nestjs/testing';
import { FileSubmissionResolver } from './file-submission.resolver';

describe('FileSubmissionResolver', () => {
  let resolver: FileSubmissionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSubmissionResolver],
    }).compile();

    resolver = module.get<FileSubmissionResolver>(FileSubmissionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
