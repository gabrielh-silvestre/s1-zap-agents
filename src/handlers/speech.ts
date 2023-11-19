import { Chat, Message, MessageMedia } from 'whatsapp-web.js';

import { BaseHandler } from './base';
import { Agent } from '../openai/agent';
import { AgentEnum } from '../utils';

export class SpeechHandler extends BaseHandler {
  constructor(agent = new Agent(AgentEnum.audio)) {
    super(agent, '.speech');
  }

  private async toBase64(response: string): Promise<string> {
    const audio = await this.agent.transcriptText(response);
    const arrayBuffer = await audio.arrayBuffer();

    return Buffer.from(arrayBuffer).toString('base64');
  }

  async handle(_: Chat, msg: Message): Promise<boolean | null> {
    try {
      const response = await this.sendToGPT(msg.body);
      if (!response) return false;

      const base64 = await this.toBase64(response);
      const msgMedia = new MessageMedia('audio/ogg', base64);

      await msg.reply(msgMedia);
      return true;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }
}
