import { Test, TestingModule } from '@nestjs/testing';
import { StudyMaterialResolver } from './study-material.resolver';

describe('StudyMaterialResolver', () => {
  let resolver: StudyMaterialResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyMaterialResolver],
    }).compile();

    resolver = module.get<StudyMaterialResolver>(StudyMaterialResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
