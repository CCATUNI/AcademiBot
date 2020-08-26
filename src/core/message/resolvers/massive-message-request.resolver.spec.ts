import { Test, TestingModule } from '@nestjs/testing';
import { MassiveMessageRequestResolver } from './massive-message-request.resolver';

describe('MassiveMessageRequestResolver', () => {
  let resolver: MassiveMessageRequestResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MassiveMessageRequestResolver],
    }).compile();

    resolver = module.get<MassiveMessageRequestResolver>(MassiveMessageRequestResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
