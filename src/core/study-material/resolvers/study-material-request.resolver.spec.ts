import { Test, TestingModule } from '@nestjs/testing';
import { StudyMaterialRequestResolver } from './study-material-request.resolver';

describe('StudyMaterialRequestResolver', () => {
  let resolver: StudyMaterialRequestResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyMaterialRequestResolver],
    }).compile();

    resolver = module.get<StudyMaterialRequestResolver>(StudyMaterialRequestResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
