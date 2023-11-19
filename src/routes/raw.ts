import { Chat } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';
import { AgentEnum } from '../utils';

export class RawRoute extends RouteBase {
  constructor(chat: Chat, agent = new Agent(AgentEnum.raw)) {
    super(chat, agent, ''); // Allow call GPT only with /gpt
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
