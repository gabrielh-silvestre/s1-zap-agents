import { Message } from 'whatsapp-web.js';

import { RouteManagerFactoryOpt } from './routes';

export type WppListener = (message: Message) => void;

export type StartAgentOpts = {
  route: RouteManagerFactoryOpt[];
};
