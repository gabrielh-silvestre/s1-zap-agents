import { Chat, Message } from 'whatsapp-web.js';

import { BaseHandler } from '.';

export class TranscribeHandler extends BaseHandler {
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
      const buffer = Buffer.from(audio.data, 'base64');

      const response = await this.agent?.transcriptAudio(buffer);
      if (!response) return false;

      await msg.reply(response);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
