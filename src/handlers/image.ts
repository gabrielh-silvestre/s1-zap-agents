import { Chat, Message, MessageTypes } from 'whatsapp-web.js';
import { BaseHandler } from './base';

export class ImageHandler extends BaseHandler {
  async shouldExecute(msg: Message): Promise<boolean> {
    if (!msg.fromMe) return false;

    const canExecute = this.matchCommand(msg) && this.isImage(msg);
    return canExecute;
  }

  protected isImage(msg: Message): boolean {
    return msg.hasMedia && msg.type === MessageTypes.IMAGE;
  }

  async handle(_: Chat, msg: Message): Promise<boolean> {
    try {
      const media = await msg.downloadMedia();
      const buffer = Buffer.from(media.data, 'base64');

      /* Generator Example
      const streamResponses = this.agent.genChatImage(msg.body, {
        image: buffer,
        mimetype: media.mimetype,
      });
      for await (const res of streamResponses) {
        if (!res) continue;
        await msg.reply(this.formatAnswer(res));
      } */

      const response = await this.agent.chatImage(msg.body, {
        image: buffer,
        mimetype: media.mimetype,
      });
      if (!response) return false;

      await msg.reply(this.formatAnswer(response));

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
