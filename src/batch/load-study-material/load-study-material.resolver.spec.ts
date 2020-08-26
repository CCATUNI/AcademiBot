import { Test, TestingModule } from '@nestjs/testing';
import { LoadStudyMaterialResolver } from './load-study-material.resolver';

describe('LoadStudyMaterialResolver', () => {
  let resolver: LoadStudyMaterialResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadStudyMaterialResolver],
    }).compile();

    resolver = module.get<LoadStudyMaterialResolver>(LoadStudyMaterialResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
