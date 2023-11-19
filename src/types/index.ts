import { Events, Message } from 'whatsapp-web.js';

import { BaseHandler } from '../handlers';

export type WppListener = (message: Message) => void;

export type RouteManagerFactoryOpt = {
  event: Events;
  handlers: (typeof BaseHandler)[];
};
