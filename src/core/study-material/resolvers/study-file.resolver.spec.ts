import { Test, TestingModule } from '@nestjs/testing';
import { StudyFileResolver } from './study-file.resolver';

describe('StudyFileResolver', () => {
  let resolver: StudyFileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyFileResolver],
    }).compile();

    resolver = module.get<StudyFileResolver>(StudyFileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
