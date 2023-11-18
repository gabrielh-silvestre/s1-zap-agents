import { Chat } from 'whatsapp-web.js';
import { RouteBase } from './base';

export class HelpRoute extends RouteBase {
  constructor(chat: Chat) {
    super('help', chat);
  }

  async answer(): Promise<string | null> {
    return 'Available commands: /gpt.raw, /gpt.help';
  }
}
