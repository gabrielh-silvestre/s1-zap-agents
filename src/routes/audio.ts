import { Chat, Message } from 'whatsapp-web.js';

import { RouteBase } from './base';
import { Agent } from '../openai/agent';
import { AgentEnum } from '../utils';

export class AudioRoute extends RouteBase {
  name = 'AudioRoute';

  constructor(chat: Chat, agent = new Agent(AgentEnum.audio)) {
    super(chat, agent);
  }

  protected shouldExecute(message: Message): boolean {
    return message.hasMedia && !message.hasQuotedMsg;
  }

  async handle(msg: Message): Promise<boolean | null> {
    try {
      const media = await msg.downloadMedia();
      const { text } = await this.agent.transcriptAudio(media.data);

      const response = await this.sendToGPT(text);
      await this.chat.sendMessage(response);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
