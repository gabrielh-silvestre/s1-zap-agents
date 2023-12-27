import { beforeEach, describe, expect, it } from 'bun:test';

import { isAudioMsg } from '../../../src/utils/helpers';
import { mockAgent, mockWppChat, mockWppMessage } from '../../mocks';

describe('[Unit] Tests for isAudioMsg helper', () => {
  let mockedMessage: any;
  let mockedChat: any;
  let mockedAgent: any;

  beforeEach(() => {
    mockedMessage = mockWppMessage();
    mockedChat = mockWppChat();
    mockedAgent = mockAgent();
  });

  it('should return false if message has no media', () => {
    // Arrange
    mockedMessage.hasMedia = false;

    // Act
    const act = () => isAudioMsg(mockedMessage);

    // Assert
    expect(act()).toBe(false);
  });

  it('should return false if message is not audio', () => {
    // Arrange
    mockedMessage.hasMedia = true;
    mockedMessage.type = 'image';

    // Act
    const act = () => isAudioMsg(mockedMessage);

    // Assert
    expect(act()).toBe(false);
  });

  it('should return true if message is audio', () => {
    // Arrange
    mockedMessage.hasMedia = true;
    mockedMessage.type = 'ptt';

    // Act
    const act = () => isAudioMsg(mockedMessage);

    // Assert
    expect(act()).toBe(true);
  });
});