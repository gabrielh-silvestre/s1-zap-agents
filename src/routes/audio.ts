import { Chat, Message } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';
import { AgentEnum } from '../utils';

export class AudioRoute extends RouteBase {
  constructor(chat: Chat, agent = new Agent(AgentEnum.audio)) {
    super(chat, agent);
  }

  protected shouldExecute(message: Message): boolean {
    return message.hasMedia && !message.hasQuotedMsg;
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
