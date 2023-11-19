import { Chat } from 'whatsapp-web.js';

import { RouteManager } from './manager';

import { HelpRoute } from './help';
import { RawRoute } from './raw';
import { CodeRoute } from './code';
import { SpeechRoute } from './speech';

export class Router {
  readonly manager: RouteManager;

  constructor(chat: Chat) {
    this.manager = new RouteManager(
      new RawRoute(chat),
      new HelpRoute(chat),
      new CodeRoute(chat),
      new SpeechRoute(chat)
    );
  }
}
