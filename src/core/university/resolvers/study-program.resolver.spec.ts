import { Test, TestingModule } from '@nestjs/testing';
import { StudyProgramResolver } from './study-program.resolver';

describe('StudyProgramResolver', () => {
  let resolver: StudyProgramResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyProgramResolver],
    }).compile();

    resolver = module.get<StudyProgramResolver>(StudyProgramResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
