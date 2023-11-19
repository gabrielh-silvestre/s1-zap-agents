import { Events, Message } from 'whatsapp-web.js';

import { Agent } from '../openai/agent';

export type WppListener = (message: Message) => void;

export type HandlerOpt = {
  /**
   * @description The handler class, must extends BaseHandler
   * @see BaseHandler
   */
  handler: any;
  agent?: Agent;
};

export type RouteManagerFactoryOpt = {
  event: Events;
  handlers: HandlerOpt[];
};
