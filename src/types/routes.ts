import { Events } from 'whatsapp-web.js';
import { HandlerOpts } from './handlers';

export type RouteHandlerOpts = {
  /**
   * @description The handler class, must extends BaseHandler
   * @see BaseHandler
   */
  handler: any;
  opts?: HandlerOpts;
};

export type RouteManagerFactoryOpt = {
  event: Events;
  handlers: RouteHandlerOpts[];
};
