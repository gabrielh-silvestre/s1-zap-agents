import { Chat } from 'whatsapp-web.js';

import { RouteBase } from './base';

export class RawRoute extends RouteBase {
  constructor(chat: Chat) {
    super('raw', chat);
  }

  async answer(msg: string): Promise<string | null> {
    console.log('RAW', msg);
    return await this.sendToGPT(msg);
  }
}