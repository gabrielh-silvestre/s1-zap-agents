import { Chat, Message } from 'whatsapp-web.js';

import { BaseHandler } from './base';

export class AudioHandler extends BaseHandler {
  name = 'AudioRoute';

  shouldExecute(message: Message): boolean {
    if (!message.fromMe) return false;

    const canExecute = this.matchCommand(message) && this.isAudio(message);
    return canExecute;
  }

  protected isAudio(msg: Message): boolean {
    return msg.hasMedia && msg.type === 'ptt';
  }

  async handle(_: Chat, msg: Message): Promise<boolean | null> {
    try {
      const media = await msg.downloadMedia();
      const buffer = Buffer.from(media.data, 'base64');

      const transcription = await this.agent?.transcriptAudio(buffer);
      if (!transcription) return false;

      /* Generator Example
      for await (const res of this.agent?.genChat(transcription)) {
        if (!res) continue;
        await msg.reply(this.formatAnswer(res));
      } */

      const res = await this.agent?.chat(transcription);
      if (!res) return false;

      await msg.reply(this.formatAnswer(res));

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
