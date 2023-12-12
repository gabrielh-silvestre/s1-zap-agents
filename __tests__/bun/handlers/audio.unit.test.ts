import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { Message } from 'whatsapp-web.js';

import { AudioHandler } from '../../../src/handlers/audio';
import { mockAgent, mockWppChat, mockWppMessage } from '../../mocks';

class AudioHandlerImp extends AudioHandler {
  isAudio(msg: Message): boolean {
    return super.isAudio(msg);
  }
}

describe('[Unit] Tests for AudioHandler (default behavior)', () => {
  let handler: AudioHandlerImp;

  let mockedMessage: any;
  let mockedChat: any;
  let mockedAgent: any;

  beforeEach(() => {
    mockedMessage = mockWppMessage();
    mockedChat = mockWppChat();
    mockedAgent = mockAgent();

    handler = new AudioHandlerImp({ agent: mockedAgent });
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('.isAudio', () => {
    it('should return false if message has no media', () => {
      // Arrange
      mockedMessage.hasMedia = false;

      // Act
      const act = () => handler.isAudio(mockedMessage);

      // Assert
      expect(act()).toBe(false);
    });

    it('should return false if message is not audio', () => {
      // Arrange
      mockedMessage.hasMedia = true;
      mockedMessage.type = 'image';

      // Act
      const act = () => handler.isAudio(mockedMessage);

      // Assert
      expect(act()).toBe(false);
    });

    it('should return true if message is audio', () => {
      // Arrange
      mockedMessage.hasMedia = true;
      mockedMessage.type = 'ptt';

      // Act
      const act = () => handler.isAudio(mockedMessage);

      // Assert
      expect(act()).toBe(true);
    });
  });

  describe('.shouldExecute', () => {
    it('should return false if message is not audio', () => {
      // Arrange
      mockedMessage.hasMedia = true;
      mockedMessage.type = 'image';

      // Act
      const act = () => handler.shouldExecute(mockedMessage);

      // Assert
      expect(act()).resolves.toBe(false);
    });

    it('should return false if message is not from me', () => {
      // Arrange
      mockedMessage.fromMe = false;
      mockedMessage.hasMedia = true;
      mockedMessage.type = 'ptt';

      // Act
      const act = () => handler.shouldExecute(mockedMessage);

      // Assert
      expect(act()).resolves.toBe(false);
    });

    it('should return true if message is audio', () => {
      // Arrange
      mockedMessage.fromMe = true;
      mockedMessage.hasMedia = true;
      mockedMessage.type = 'ptt';

      // Act
      const act = () => handler.shouldExecute(mockedMessage);

      // Assert
      expect(act()).resolves.toBe(true);
    });
  });

  describe('.handle', () => {
    it.each([
      ['audio transcription return null', null],
      ['audio transcription return undefined', undefined],
      ['audio transcription return "[empty string]"', ''],
    ])('should return false if %s fail', async (_, value) => {
      // Arrange
      mockedAgent.transcriptAudio = mock(async () => value);

      // Act
      const act = () => handler.handle(mockedChat, mockedMessage);

      // Assert
      expect(await act()).toBe(false);
    });

    it.each([
      ['chat agent return null', null],
      ['chat agent return undefined', undefined],
      ['chat agent return "[empty string]"', ''],
    ])('should return false if %s fail', async (_, value) => {
      // Arrange
      mockedAgent.chat = mock(async () => value);

      // Act
      const act = () => handler.handle(mockedChat, mockedMessage);

      // Assert
      expect(await act()).toBe(false);
    });

    it('should return true when handle with success', async () => {
      // Act
      const act = () => handler.handle(mockedChat, mockedMessage);

      // Assert
      expect(await act()).toBe(true);
    });

    it('should return null if any error occurs', async () => {
      // Arrange
      mockedAgent.transcriptAudio.mockRejectedValue(new Error('test'));

      // Act
      const act = () => handler.handle(mockedChat, mockedMessage);

      // Assert
      expect(await act()).toBe(null);
    });
  });
});
