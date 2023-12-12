import { Chat, Message, MessageMedia } from 'whatsapp-web.js';

import { BaseHandler } from './base';

export class SpeechHandler extends BaseHandler {
  async shouldExecute(msg: Message): Promise<boolean> {
    if (!msg.fromMe) return false;

    const canExecute =
      this.matchCommand(msg) &&
      (msg.hasMedia || msg.hasQuotedMsg || msg.type === 'chat');
    return canExecute;
  }

  async handle(_: Chat, msg: Message): Promise<boolean | null> {
    try {
      const quote = await msg.getQuotedMessage();

      const response = await this.agent?.transcriptText(quote.body);
      if (!response) return false;

      const base64 = Buffer.from(response).toString('base64');
      const msgMedia = new MessageMedia('audio/ogg', base64);

      await msg.reply(msgMedia);
      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
