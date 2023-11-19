import { Chat, Message, MessageMedia } from 'whatsapp-web.js';

import { BaseHandler } from './base';

export class SpeechHandler extends BaseHandler {
  shouldExecute(msg: Message): boolean {
    if (!msg.fromMe) return false;

    const canExecute =
      this.matchCommand(msg) &&
      (msg.hasMedia || msg.hasQuotedMsg || msg.type === 'chat');
    return canExecute;
  }

  private async toBase64(response: string): Promise<string> {
    const audio = await this.agent?.transcriptText(response);
    if (!audio) throw new Error('Failed to generate audio');

    const arrayBuffer = await audio.arrayBuffer();

    return Buffer.from(arrayBuffer).toString('base64');
  }

  async handle(_: Chat, msg: Message): Promise<boolean | null> {
    try {
      const quote = await msg.getQuotedMessage();

      const response = await this.agent?.complet(quote.body);
      if (!response) return false;

      const base64 = await this.toBase64(response);
      const msgMedia = new MessageMedia('audio/ogg', base64);

      await msg.reply(msgMedia);
      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
