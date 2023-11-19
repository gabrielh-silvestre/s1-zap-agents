import { Chat } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';
import { AgentEnum } from '../utils';

export class CodeRoute extends RouteBase {
  constructor(chat: Chat, agent = new Agent(AgentEnum.code)) {
    super(chat, agent, '.code');
  }

  async answer(msg: string): Promise<boolean | null> {
    try {
      const response = await this.sendToGPT(msg);

      await this.chat.sendMessage(response);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
