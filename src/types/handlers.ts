import { ZapAgent } from '../openai/agent';

export enum StartAgentMode {
  Safe = 'SAFE',
  Override = 'OVERRIDE',
  Throw = 'THROW',
}

export type HandlerOpts = {
  command?: string | null;
  agent?: ZapAgent | null;
};
