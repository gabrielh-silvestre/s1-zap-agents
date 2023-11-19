import { Chat } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';

export class HelpRoute extends RouteBase {
  constructor(chat: Chat) {
    // IMPORTANT: This agentId is not valid, because this route does not use GPT
    super(chat, {} as Agent, '.help');
  }

  async answer(): Promise<boolean | null> {
    await this.chat.sendMessage(
      'Available commands: /gpt, /gpt.help, /gpt.code'
    );

    return true;
  }
}
