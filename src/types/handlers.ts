import { Agent } from '../openai/agent';

export type HandlerOpts = {
  command?: string | null;
  agent?: Agent | null;
};
