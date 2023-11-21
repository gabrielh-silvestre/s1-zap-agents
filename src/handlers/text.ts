import { Chat, Message } from 'whatsapp-web.js';

import { BaseHandler } from './base';

export class TextHandler extends BaseHandler {
  shouldExecute(msg: Message): boolean {
    if (!msg.fromMe) return false;

    const canExecute =
      this.matchCommand(msg) &&
      (!msg.hasMedia || !msg.hasQuotedMsg || msg.type === 'chat');
    return canExecute;
  }

  protected getMsgBody(msg: Message): string {
    const isCommandString = typeof this.command === 'string';
    return isCommandString
      ? msg.body.replace(this.command ?? '', '').trim()
      : '';
  }

  async handle(_: Chat, msg: Message): Promise<boolean | null> {
    try {
      const response = await this.agent?.complet(this.getMsgBody(msg));
      if (!response) return false;

      await msg.reply(response);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
