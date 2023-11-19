import { Chat } from 'whatsapp-web.js';

import { BaseHandler } from './base';
import { Agent } from '../openai/agent';

export class RootHandler extends BaseHandler {
  constructor(public agent: Agent) {
    super(''); // Allow call GPT only with /gpt
  }

  async answer(chat: Chat, msg: string): Promise<boolean | null> {
    try {
      const response = await this.agent.complet(msg);
      if (!response) return false;

      await chat.sendMessage(response);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
