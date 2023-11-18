import { Chat } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';

export class HelpRoute extends RouteBase {
  constructor(chat: Chat) {
    // IMPORTANT: This agentId is not valid, because this route does not use GPT
    super('help', chat, {} as Agent);
  }

  async answer(): Promise<string | null> {
    return 'Available commands: /gpt.raw, /gpt.help, /gpt.code';
  }
}
