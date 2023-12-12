import { beforeEach, describe, expect, it, mock } from 'bun:test';

import { Message } from 'whatsapp-web.js';
import { TextHandler } from '../../../src/handlers/text';
import {
  MOCKED_COMMAND,
  mockAgent,
  mockWppChat,
  mockWppMessage,
} from '../../mocks';

class TextHandlerImp extends TextHandler {
  getMsgBody(msg: Message): string {
    return super.getMsgBody(msg);
  }
}

describe('[Unit] Tests for TextHandler (default behavior)', () => {
  let handler: TextHandlerImp;

  let mockedMessage: any;
  let mockedChat: any;
  let mockedAgent: any;

  beforeEach(() => {
    mockedMessage = mockWppMessage();
    mockedChat = mockWppChat();
    mockedAgent = mockAgent();

    handler = new TextHandlerImp({
      agent: mockedAgent,
      command: MOCKED_COMMAND,
    });
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('.getMsgBody', () => {
    it('should return empty string if command and name is not string', () => {
      // Arrange
      // @ts-ignore
      handler.command = undefined;

      // Act
      const act = () => handler.getMsgBody(mockedMessage);

      // Assert
      expect(act()).toBe('');
    });

    it('should not modify string if command is not found', () => {
      // Arrange
      // @ts-ignore
      handler.command = 'not-found';

      // Act
      const act = () => handler.getMsgBody(mockedMessage);

      // Assert
      expect(act()).toBe(mockedMessage.body);
    });

    it('should return empty string if command is found but message has no body', () => {
      // Arrange
      mockedMessage.body = '';

      // Act
      const act = () => handler.getMsgBody(mockedMessage);

      // Assert
      expect(act()).toBe('');
    });

    it('should return message body without command', () => {
      // Arrange
      mockedMessage.body = `${MOCKED_COMMAND} trem`;

      // Act
      const act = () => handler.getMsgBody(mockedMessage);

      // Assert
      expect(act()).toBe('trem');
    });
  });

  describe('.shouldExecute', () => {
    it('should return false if message is not from me', () => {
      // Arrange
      mockedMessage.fromMe = false;

      // Act
      const act = () => handler.shouldExecute(mockedMessage);

      // Assert
      expect(act()).toBe(false);
    });

    it('should return false if message has media', () => {
      // Arrange
      mockedMessage.hasMedia = true;

      // Act
      const act = () => handler.shouldExecute(mockedMessage);

      // Assert
      expect(act()).toBe(false);
    });

    it('should return false if message has quoted message', () => {
      // Arrange
      mockedMessage.hasQuotedMsg = true;

      // Act
      const act = () => handler.shouldExecute(mockedMessage);

      // Assert
      expect(act()).toBe(false);
    });

    it('should return false if message type is not chat', () => {
      // Arrange
      mockedMessage.type = 'image';

      // Act
      const act = () => handler.shouldExecute(mockedMessage);

      // Assert
      expect(act()).toBe(false);
    });

    it('should return true if message is from me and has no media', () => {
      // Arrange
      mockedMessage.fromMe = true;
      mockedMessage.hasMedia = false;

      // Act
      const act = () => handler.shouldExecute(mockedMessage);

      // Assert
      expect(act()).toBe(true);
    });
  });

  describe('.handle', () => {
    it.each([
      ['chat agent return null', null],
      ['chat agent return undefined', undefined],
      ['chat agent return "[empty string]"', ''],
    ])('should return false if %s', async (_, value) => {
      // Arrange
      mockedAgent.chat.mockResolvedValue(value);

      // Act
      const act = () => handler.handle(mockedChat, mockedMessage);

      // Assert
      expect(await act()).toBe(false);
    });

    it('should return true if chat agent return string', async () => {
      // Arrange
      mockedAgent.chat.mockResolvedValue('test');

      // Act
      const act = () => handler.handle(mockedChat, mockedMessage);

      // Assert
      expect(await act()).toBe(true);
    });

    it('should return null if any error occurs', async () => {
      // Arrange
      mockedAgent.chat.mockRejectedValue(new Error('test'));

      // Act
      const act = () => handler.handle(mockedChat, mockedMessage);

      // Assert
      expect(await act()).toBe(null);
    });
  });
});
