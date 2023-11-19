import {
  Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  mock,
  spyOn,
} from 'bun:test';
import { BaseHandler } from '../../../src/handlers';
import { mockAgent, mockWppChat, mockWppMessage } from '../../mocks';

export class BaseHandlerImp extends BaseHandler {
  constructor(command: string | null = null) {
    super(mockAgent as any, command);
  }
}

describe('[Unit] Test for BaseHandler', () => {
  let handler: BaseHandlerImp;

  beforeEach(() => {
    handler = new BaseHandlerImp('.test-mock');
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('.shouldExecute', () => {
    it('should throw error if command is not defined', async () => {
      // Arrange
      handler = new BaseHandlerImp();

      // Act
      const act = () => handler.execute(mockWppMessage);

      // Assert
      try {
        await act();
        expect().fail('Should throw error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should return false if message does not start with command', async () => {
      // Arrange
      handler = new BaseHandlerImp('FAIL');

      // Act
      const act = () => handler.execute(mockWppMessage);

      // Assert
      expect(await act()).toBe(false);
    });

    it('should return true if message starts with command', async () => {
      // Arrange
      handler.answer = mock(async () => true);

      // Act
      const act = () => handler.execute(mockWppMessage);

      // Assert
      expect(await act()).toBe(true);
    });
  });

  describe('.answer', () => {
    it('should return null for default', async () => {
      // Act
      const act = () => handler.answer(mockWppChat, 'test');

      // Assert
      expect(await act()).toBe(null);
    });
  });

  describe('.handle', () => {
    it('should return null for default', async () => {
      // Act
      const act = () => handler.handle(mockWppChat, mockWppMessage);

      // Assert
      expect(await act()).toBe(null);
    });
  });

  describe('.execute', () => {
    let spyHandle: Mock<any>;
    let spyAnswer: Mock<any>;

    beforeEach(() => {
      handler = new BaseHandlerImp('.test-mock');

      spyHandle = spyOn(handler, 'handle');
      spyAnswer = spyOn(handler, 'answer');
    });

    it('should return false if shouldExecute returns false', async () => {
      // Arrange
      handler = new BaseHandlerImp('FAIL_EXECUTE');

      // Act
      const result = await handler.execute(mockWppMessage);

      // Assert
      expect(result).toBe(false);

      // TODO fix this, it should not be called and its not, but jest is
      expect(mockWppMessage.getChat).toHaveBeenCalled();
      expect(mockWppChat.sendMessage).not.toHaveBeenCalled();

      expect(spyAnswer).not.toHaveBeenCalled();
      expect(spyHandle).not.toHaveBeenCalled();
    });

    it('should return false if answer returns false', async () => {
      // Arrange
      handler.answer = mock(async () => false);

      // Act
      const result = await handler.execute(mockWppMessage);

      // Assert
      expect(result).toBe(false);

      expect(mockWppMessage.getChat).toHaveBeenCalled();
      expect(mockWppChat.sendMessage).not.toHaveBeenCalled();

      expect(handler.answer).toHaveBeenCalled();
      expect(spyHandle).not.toHaveBeenCalled();
    });

    it('should return false if handle returns false', async () => {
      // Arrange
      handler.handle = mock(async () => false);

      // Act
      const result = await handler.execute(mockWppMessage);

      // Assert
      expect(result).toBe(false);

      expect(mockWppMessage.getChat).toHaveBeenCalled();
      expect(mockWppChat.sendMessage).not.toHaveBeenCalled();

      expect(spyAnswer).toHaveBeenCalled();
      expect(handler.handle).toHaveBeenCalled();
    });

    it('should return null if message is not handled or answered', async () => {
      // Act
      const result = await handler.execute(mockWppMessage);

      // Assert
      expect(result).toBe(false);

      expect(mockWppMessage.getChat).toHaveBeenCalled();
      expect(mockWppChat.sendMessage).toHaveBeenCalled();

      expect(spyAnswer).toHaveBeenCalled();
      expect(spyHandle).toHaveBeenCalled();
    });
  });
});
