import { Chat, Message } from 'whatsapp-web.js';

import { BaseHandler } from './base';
import { Agent } from '../openai/agent';

export class AudioHandler extends BaseHandler {
  name = 'AudioRoute';

  constructor(public agent: Agent) {
    super();
  }

  protected shouldExecute(message: Message): boolean {
    return message.hasMedia && !message.hasQuotedMsg;
  }

  async handle(chat: Chat, msg: Message): Promise<boolean | null> {
    try {
      const media = await msg.downloadMedia();
      const { text } = await this.agent.transcriptAudio(media.data);

      const response = await this.agent.complet(text);
      if (!response) return false;

      await chat.sendMessage(response);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
