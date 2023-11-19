import { Chat, Message } from 'whatsapp-web.js';
import { Agent } from '../openai/agent';

export abstract class BaseHandler {
  protected command: string | null = null;

  protected readonly agent: Agent;

  name: string = 'BASE';

  constructor(agent: Agent, command: string | null = null) {
    this.agent = agent;

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

  protected async sendToGPT(message: string): Promise<string | never> {
    const response = await this.agent.complet(message);
    if (!response) throw new Error('No response from GPT');

    return response;
  }

  async execute(message: Message): Promise<boolean> {
    const shouldReply = this.shouldExecute(message);
    if (!shouldReply) return false;

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

    return true;
  }
}
