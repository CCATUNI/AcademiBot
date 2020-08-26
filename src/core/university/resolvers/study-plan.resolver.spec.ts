import { Test, TestingModule } from '@nestjs/testing';
import { StudyPlanResolver } from './study-plan.resolver';

describe('StudyPlanResolver', () => {
  let resolver: StudyPlanResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyPlanResolver],
    }).compile();

    resolver = module.get<StudyPlanResolver>(StudyPlanResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
