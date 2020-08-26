import { Test, TestingModule } from '@nestjs/testing';
import { LoadStudyMaterialService } from './load-study-material.service';

describe('LoadStudyMaterialService', () => {
  let service: LoadStudyMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoadStudyMaterialService],
    }).compile();

    service = module.get<LoadStudyMaterialService>(LoadStudyMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
