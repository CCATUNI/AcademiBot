import { Test, TestingModule } from '@nestjs/testing';
import { UniversityResolver } from './university.resolver';

describe('UniversityResolver', () => {
  let resolver: UniversityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniversityResolver],
    }).compile();

    resolver = module.get<UniversityResolver>(UniversityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
