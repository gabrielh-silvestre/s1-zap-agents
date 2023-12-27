import { Message } from 'whatsapp-web.js';

import { RouteManagerFactoryOpt } from './routes';

export * from './agent';
export * from './handlers';
export * from './routes';

export type WppListener = (message: Message) => void;

export type StartAgentOpts = {
  route: RouteManagerFactoryOpt[];
};
