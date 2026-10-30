import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return ok for NEXUS Conf 2026', () => {
      expect(appController.health()).toEqual({
        ok: true,
        event: 'NEXUS Conf 2026',
      });
    });
  });
});
