import { Chat, Message } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';
import { AgentEnum } from '../utils';

export class SpeechRoute extends RouteBase {
  constructor(chat: Chat) {
    super('speech', chat, new Agent(AgentEnum.raw));
  }

  transformAudiOggToBlob(media: string) {
    const base64Data = media.replace(/^data:audio\/ogg;base64,/, '');
    const blob = Buffer.from(base64Data, 'base64');

    return blob;
  }

  async handle(msg: Message): Promise<string | null> {
    try {
      const media = await msg.downloadMedia();
      const { text } = await this.agent.transcriptAudio(media.data);

      return await this.sendToGPT(text);
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
