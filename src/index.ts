import {
  AudioHandler,
  SpeechHandler,
  TranscribeHandler,
  TextHandler,
} from './handlers';
import { IAgent } from './types/agent';

export { startAgent } from './bootstrap';
export { createRouterManager } from './routes';
export { AgentOpenAI } from './openai/agent';
export * from './openai/function';

export * from './handlers';
export * from './types';

export const defaultHandlers = (agent: IAgent) => [
  { handler: AudioHandler, opts: { agent } },
  {
    handler: SpeechHandler,
    opts: { agent, command: '--to-audio' },
  },
  {
    handler: TranscribeHandler,
    opts: { agent, command: '--to-text' },
  },
  {
    handler: TextHandler,
    opts: { agent, command: '/gpt' },
  },
];
