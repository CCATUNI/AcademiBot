import { Test, TestingModule } from '@nestjs/testing';
import { StudyMaterialController } from './study-material.controller';

describe('StudyMaterial Controller', () => {
  let controller: StudyMaterialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyMaterialController],
    }).compile();

    controller = module.get<StudyMaterialController>(StudyMaterialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
