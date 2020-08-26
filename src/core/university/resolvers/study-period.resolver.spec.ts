import { Test, TestingModule } from '@nestjs/testing';
import { StudyPeriodResolver } from './study-period.resolver';

describe('StudyPeriodResolver', () => {
  let resolver: StudyPeriodResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyPeriodResolver],
    }).compile();

    resolver = module.get<StudyPeriodResolver>(StudyPeriodResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
