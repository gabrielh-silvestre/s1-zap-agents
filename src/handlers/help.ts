import { Chat } from 'whatsapp-web.js';

import { BaseHandler } from './base';
import { Agent } from '../openai/agent';

export class HelpHandler extends BaseHandler {
  constructor() {
    // IMPORTANT: This agentId is not valid, because this route does not use GPT
    super({} as Agent, '.help');
  }

  async answer(chat: Chat): Promise<boolean | null> {
    await chat.sendMessage('Available commands: /gpt, /gpt.help, /gpt.code');

    return true;
  }
}
