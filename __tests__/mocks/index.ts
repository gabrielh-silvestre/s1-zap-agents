import { mock } from 'bun:test';
import { Chat, Message } from 'whatsapp-web.js';
import { IZapAgent } from '../../src/types/agent';
import { ChatCompletion, ChatCompletionChunk } from 'openai/resources';
import { Transcription } from 'openai/resources/audio/transcriptions';
import { Response } from 'openai/_shims/auto/types';
import OpenAI from 'openai';

export const MOCKED_COMMAND = '.test-mock';

export const mockAgent = () =>
  ({
    complet: mock(async () => '[MOCKED] GPT response'),
    transcriptAudio: mock(async () => '[MOCKED] Transcript'),
    transcriptText: mock(async () => new ArrayBuffer(1)),
    chat: mock(async () => '[MOCKED] Chat'),
    chatImage: mock(async () => '[MOCKED] Chat'),
    genChat: mock(async function* () {
      yield '[MOCKED] Chat';
    }),
    genChatImage: mock(async function* () {
      yield '[MOCKED] Chat';
    }),
  } as unknown as IZapAgent);

export const mockWppChat = () =>
  ({
    sendMessage: mock(async () => ({} as Message)),
  } as unknown as Chat);

export const mockWppMediaMessage = () =>
  ({
    data: 'test',
  } as unknown as Message);

export const mockWppMessage = () =>
  ({
    body: `${MOCKED_COMMAND} MOCKED`,
    getChat: mock(async () => mockWppChat()),
    react: mock(async () => ({})),
    reply: mock(async () => ({})),
    downloadMedia: mock(async () => mockWppMediaMessage()),
  } as unknown as Message);

export const mockTranscriptionResponse = () =>
  ({
    text: 'test',
  } as unknown as Transcription);

export const mockSpeechResponse = () =>
  ({
    arrayBuffer: mock(async () => new ArrayBuffer(1)),
  } as unknown as Response);

export const mockChatResponse = () =>
  ({
    choices: [{ message: { content: 'test' } }],
  } as unknown as ChatCompletion);

export const mockChatStreamResponse = () =>
  function* () {
    yield {
      choices: [{ message: { content: 'test' } }],
    } as unknown as ChatCompletionChunk;
  };

export const mockOpenAI = (type: 'stream' | 'classic' = 'classic') =>
  ({
    chat: {
      completions: {
        create: mock(
          type === 'stream'
            ? mockChatStreamResponse()
            : async () => mockChatResponse()
        ),
      },
    },
    audio: {
      transcriptions: { create: mock(async () => mockTranscriptionResponse()) },
      speech: { create: mock(async () => mockSpeechResponse()) },
    },
  } as unknown as OpenAI);
