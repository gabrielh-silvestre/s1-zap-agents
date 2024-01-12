import {
  AudioHandler,
  SpeechHandler,
  TranscribeHandler,
  TextHandler,
  ImageHandler,
} from './handlers';
import { RouteHandlerOpts } from './types/routes';
import { ZapAgent } from './openai/agent';
import { ClearHandler } from './handlers/clear';

export { startAgent } from './bootstrap';
export { createRouterManager } from './routes';
export { ZapAgent } from './openai/agent';

export * from './handlers';
export * from './types';
export * from './utils/helpers';

export const defaultHandlers = (agent: ZapAgent): RouteHandlerOpts[] => [
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
  {
    handler: ImageHandler,
    opts: { agent, command: '/img' },
  },
  {
    handler: ClearHandler,
    opts: { agent, command: '/clear' },
  },
];
