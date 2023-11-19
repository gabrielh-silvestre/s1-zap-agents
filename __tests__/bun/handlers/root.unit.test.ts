import { beforeEach, describe, expect, it, jest, mock } from 'bun:test';
import { RootHandler } from '../../../src/handlers/root';
import { mockAgent, mockWppChat, mockWppMessage } from '../../mocks';

describe('[Unit] Test for RootHandler', () => {
  let handler: RootHandler;

  let mockedAgent: any;
  let mockedChat: any;
  let mockedMessage: any;

  beforeEach(() => {
    mockedAgent = mockAgent();
    mockedChat = mockWppChat();
    mockedMessage = mockWppMessage();

    handler = new RootHandler(mockedAgent);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('.answer', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true if agent responds', async () => {
      // Act
      const act = () => handler.answer(mockedChat, '');

      // Assert
      expect(await act()).toBe(true);

      expect(mockedAgent.complet).toHaveBeenCalledTimes(1);
      expect(mockedChat.sendMessage).toHaveBeenCalledTimes(1);
    });

    it('should return false if agent has no response', async () => {
      // Arrange
      handler.agent.complet = mock(async () => null);

      // Act
      const act = () => handler.answer(mockedChat, '');

      // Assert
      expect(await act()).toBe(false);

      expect(mockedAgent.complet).toHaveBeenCalledTimes(1);
      expect(mockedChat.sendMessage).not.toHaveBeenCalled();
    });

    it('should return null if agent throws error', async () => {
      // Arrange
      handler.agent.complet = mock(async () => {
        throw new Error('Test error');
      });

      // Act
      const act = () => handler.answer(mockedChat, '');

      // Assert
      expect(await act()).toBe(null);

      expect(mockedAgent.complet).toHaveBeenCalledTimes(1);
      expect(mockedChat.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('.execute', () => {
    it.only('should return true and execute if message starts with command', async () => {
      // Arrange
      mockedMessage.body = '/gpt MOCKED';
      mockedMessage.getChat = mock(async () => mockedChat);

      // Act
      const act = () => handler.execute(mockedMessage);

      // Assert
      expect(await act()).toBe(true);

      expect(mockedAgent.complet).toHaveBeenCalledTimes(1);
      expect(mockedChat.sendMessage).toHaveBeenCalled();
    });

    it('should return false and not execute if message does not start with command', async () => {
      // Arrange
      mockedMessage.body = 'FAIL';

      // Act
      const act = () => handler.execute(mockedMessage);

      // Assert
      expect(await act()).toBe(false);

      expect(mockedAgent.complet).not.toHaveBeenCalled();
      expect(mockedChat.sendMessage).not.toHaveBeenCalled();
    });
  });
});
