import { ZapAgent } from '../openai/agent';

export type HandlerOpts = {
  command?: string | null;
  agent?: ZapAgent | null;
};
