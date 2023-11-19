import { Chat } from 'whatsapp-web.js';

import { BaseHandler } from './base';
import { Agent } from '../openai/agent';
import { AgentEnum } from '../utils';

export class CodeHandler extends BaseHandler {
  constructor(agent = new Agent(AgentEnum.code)) {
    super(agent, '.code');
  }

  async answer(chat: Chat, msg: string): Promise<boolean | null> {
    try {
      const response = await this.sendToGPT(msg);

      await chat.sendMessage(response);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
