import { mock } from 'bun:test';
import { Chat, Message } from 'whatsapp-web.js';

export const mockAgent = {
  complet: mock(async () => '[MOCKED] GPT response'),
};

export const mockWppChat = {
  sendMessage: mock(async () => ({} as Message)),
} as unknown as Chat;

export const mockWppMessage = {
  body: '/gpt.test-mock MOCKED',
  getChat: mock(async () => mockWppChat),
} as unknown as Message;
