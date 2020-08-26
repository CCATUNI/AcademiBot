import { Test, TestingModule } from '@nestjs/testing';
import { UniversityDivisionResolver } from './university-division.resolver';

describe('UniversityDivisionResolver', () => {
  let resolver: UniversityDivisionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniversityDivisionResolver],
    }).compile();

    resolver = module.get<UniversityDivisionResolver>(UniversityDivisionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
