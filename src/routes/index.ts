import { Chat } from 'whatsapp-web.js';

import { RouteManager } from './manager';

import { HelpRoute } from './help';
import { RawRoute } from './raw';

export class Router {
  readonly manager: RouteManager;

  constructor(chat: Chat) {
    this.manager = new RouteManager(new RawRoute(chat), new HelpRoute(chat));
  }
}
