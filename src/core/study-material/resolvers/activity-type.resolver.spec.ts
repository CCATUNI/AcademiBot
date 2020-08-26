import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypeResolver } from './activity-type.resolver';

describe('ActivityTypeResolver', () => {
  let resolver: ActivityTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityTypeResolver],
    }).compile();

    resolver = module.get<ActivityTypeResolver>(ActivityTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
