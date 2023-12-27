import { Chat, Message } from 'whatsapp-web.js';

import { BaseHandler } from './base';

export class TranscribeHandler extends BaseHandler {
  async shouldExecute(msg: Message): Promise<boolean> {
    if (!msg.fromMe) return false;

    if (!msg.hasQuotedMsg) return false;
    const quotedMsg = await msg.getQuotedMessage();

    const canExecute = this.matchCommand(msg) && (quotedMsg.hasMedia || msg.type === 'chat');
    return canExecute;
  }

  async handleQuoted(_: Chat, msg: Message): Promise<boolean | null> {
    try {
      const audio = await msg.downloadMedia();
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
