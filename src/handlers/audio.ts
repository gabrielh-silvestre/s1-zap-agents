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

      const transcription = await this.agent?.transcriptAudio(media.data);
      if (!transcription) return false;

      // console.log(transcription.text);

      const response = await this.agent?.complet(transcription.text);
      if (!response) return false;

      await msg.reply(response);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
