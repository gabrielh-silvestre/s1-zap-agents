import { Chat, Message } from 'whatsapp-web.js';

import { BaseHandler } from '.';

export class TracribeHandler extends BaseHandler {
  shouldExecute(msg: Message): boolean {
    if (!msg.fromMe) return false;

    const canExecute =
      this.matchCommand(msg) &&
      (msg.hasMedia || msg.hasQuotedMsg || msg.type === 'chat');
    return canExecute;
  }

  async handle(_: Chat, msg: Message): Promise<boolean | null> {
    try {
      const quote = await msg.getQuotedMessage();
      const audio = await quote.downloadMedia();

      const response = await this.agent?.transcriptAudio(audio.data);
      if (!response) return false;

      await msg.reply(response.text);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
