import { Chat, Message } from 'whatsapp-web.js';

import { BaseHandler } from './base';

export class TextHandler extends BaseHandler {
  async shouldExecute(msg: Message): Promise<boolean> {
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
      /* Generator Example
      for await (const res of this.agent.genChat(this.getMsgBody(msg))) {
        if (!res) continue;
        await msg.reply(this.formatAnswer(res));
      } */

      const res = await this.agent.chat(this.getMsgBody(msg));
      if (!res) return false;

      await msg.reply(this.formatAnswer(res));

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
