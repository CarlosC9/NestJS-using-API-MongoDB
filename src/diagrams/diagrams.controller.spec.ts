import { Test, TestingModule } from '@nestjs/testing';
import { DiagramsController } from './diagrams.controller';

describe('Diagrams Controller', () => {
  let controller: DiagramsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiagramsController],
    }).compile();

    controller = module.get<DiagramsController>(DiagramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
