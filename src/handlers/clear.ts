import { Chat, Message } from 'whatsapp-web.js';
import { TextHandler } from './text';

export class ClearHandler extends TextHandler {
  async handle(_: Chat, msg: Message): Promise<boolean> {
    try {
      const chat = await msg.getChat();
      if (!chat) return false;

      await chat.clearMessages();
      this.agent.clearChat();

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
