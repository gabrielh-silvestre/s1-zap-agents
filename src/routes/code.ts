import { Chat } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';
import { AgentEnum } from '../utils';

export class CodeRoute extends RouteBase {
  constructor(chat: Chat, agent = new Agent(AgentEnum.code)) {
    super(chat, agent, '.code');
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
