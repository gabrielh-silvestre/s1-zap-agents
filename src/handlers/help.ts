import { Chat } from 'whatsapp-web.js';

import { BaseHandler } from './base';

export class HelpHandler extends BaseHandler {
  constructor() {
    super('.help');
  }

  async answer(chat: Chat): Promise<boolean | null> {
    await chat.sendMessage('Available commands: /gpt, /gpt.help, /gpt.code');

    return true;
  }
}
