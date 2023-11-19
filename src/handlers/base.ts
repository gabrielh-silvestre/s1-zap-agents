import { Chat, Message } from 'whatsapp-web.js';

export abstract class BaseHandler {
  protected command: string | null = null;

  name: string = 'BASE';

  constructor(command: string | null = null) {
    if (command !== null) {
      this.command = `/gpt${command}`;
      this.name = this.command;
    }
  }

  protected shouldExecute(message: Message): boolean {
    if (!this.command) {
      throw new Error('Command not defined and shouldExecute not overrided');
    }

    return message.body.startsWith(this.command);
  }

  async answer(chat: Chat, msg: string): Promise<boolean | null> {
    return null;
  }

  async handle(chat: Chat, msg: Message): Promise<boolean | null> {
    return null;
  }

  async execute(message: Message): Promise<boolean> {
    const shouldReply = this.shouldExecute(message);
    if (!shouldReply) return false;

    console.log(`Executing ${this.name} handler`);

    const content = this.command
      ? message.body.replace(this.command, '').trim()
      : message.body;

    const chat = await message.getChat();

    let response: boolean | null = null;
    response ??= await this.answer(chat, content);
    response ??= await this.handle(chat, message);

    if (response === null) {
      await chat.sendMessage('No response, unexpected error');
      return false;
    }

    return response;
  }
}
