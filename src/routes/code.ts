import { Chat } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';

export class CodeRoute extends RouteBase {
  constructor(chat: Chat, agent = new Agent('asst_eY37OZdnJXXwXC0Rt9uIymav')) {
    super('code', chat, agent);
  }

  async answer(msg: string): Promise<string | null> {
    try {
      return await this.sendToGPT(msg);
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
