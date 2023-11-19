import { IAgent } from './agent';

export type HandlerOpts = {
  command?: string | null;
  agent?: IAgent | null;
};
