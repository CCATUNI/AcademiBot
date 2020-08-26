import { Test, TestingModule } from '@nestjs/testing';
import { PlatformResolver } from './platform.resolver';

describe('PlatformResolver', () => {
  let resolver: PlatformResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlatformResolver],
    }).compile();

    resolver = module.get<PlatformResolver>(PlatformResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
