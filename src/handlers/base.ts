import { Chat, Message } from 'whatsapp-web.js';

import { HandlerOpts } from '../types/handlers';
import { ZapAgent } from '../openai/agent';
import { GPT_MSG_IDENTIFIER } from '../utils/constants';

export abstract class BaseHandler {
  protected command: string | null = null;

  protected agent: ZapAgent | null = null;

  name: string = 'BASE';

  constructor(
    { agent = null, command = null }: HandlerOpts = {
      agent: null,
      command: null,
    }
  ) {
    this.agent = agent ?? null;

    const isCommandString = typeof command === 'string';
    if (isCommandString) {
      this.command = command;
      this.name = command ?? this.name;
    }
  }

  protected matchCommand(msg: Message): boolean {
    if (!this.command) return true;

    const isCommandString = typeof this.command === 'string';
    return isCommandString ? msg.body.startsWith(this.command) : false;
  }

  protected async getChatHistory(
    msg: Message,
    limit: number
  ): Promise<Message[]> {
    const chat = await msg.getChat();
    const messages = await chat.fetchMessages({ limit });

    return messages;
  }

  protected async startExec(msg: Message): Promise<void> {
    await msg.react('👀');
  }

  protected async catchExec(msg: Message, error: Error): Promise<void> {
    await msg.react('❌');

    const errorMsg = error.message ?? 'FATAL ERROR';
    await msg.reply(`Error: ${errorMsg}\nSend a ticket`);
  }

  protected formatAnswer(answer: string): string {
    return `${GPT_MSG_IDENTIFIER}\n${answer.trim()}`;
  }

  abstract shouldExecute(msg: Message): boolean;

  async answer(chat: Chat, msg: string): Promise<boolean | null> {
    return null;
  }

  async handle(chat: Chat, msg: Message): Promise<boolean | null> {
    return null;
  }

  async execute(message: Message): Promise<boolean> {
    console.log(`[${this.name}] Executing...`);
    const chat = await message.getChat();

    try {
      await this.startExec(message);

      const content =
        message.body && this.command
          ? message.body.replace(this.command, '').trim()
          : message.body;

      let response: boolean | null = null;
      response ??= await this.handle(chat, message);
      response ??= await this.answer(chat, content);

      if (response === null) {
        await chat.sendMessage('No response, unexpected error');
        return false;
      }

      console.log(`[${this.name}]`, response ? 'OK' : 'FAIL');
      return response;
    } catch (error: any) {
      console.error(error);
      await this.catchExec(message, error);
      return false;
    }
  }
}
