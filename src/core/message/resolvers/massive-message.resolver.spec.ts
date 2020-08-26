import { Test, TestingModule } from '@nestjs/testing';
import { MassiveMessageResolver } from './massive-message.resolver';

describe('MassiveMessageResolver', () => {
  let resolver: MassiveMessageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MassiveMessageResolver],
    }).compile();

    resolver = module.get<MassiveMessageResolver>(MassiveMessageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
