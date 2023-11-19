import { Chat, Message } from 'whatsapp-web.js';
import { Agent } from '../openai/agent';

export abstract class RouteBase {
  private command: string | null = null;

  readonly chat: Chat;

  protected readonly agent: Agent;

  constructor(chat: Chat, agent: Agent, command: string | null = null) {
    this.chat = chat;
    this.agent = agent;

    if (command !== null) this.command = `/gpt${command}`;
  }

  protected shouldExecute(message: Message): boolean {
    if (!this.command) {
      throw new Error('Command not defined and shouldExecute not overrided');
    }

    return message.body.startsWith(this.command);
  }

  async answer(_: string): Promise<string | null> {
    return null;
  }

  async handle(_: Message): Promise<string | null> {
    return null;
  }

  protected async sendToGPT(message: string): Promise<string | null> {
    return await this.agent.complet(message);
  }

  async execute(message: Message): Promise<boolean> {
    const shouldReply = this.shouldExecute(message);
    if (!shouldReply) return false;

    const content = this.command
      ? message.body.replace(this.command, '').trim()
      : message.body;

    let response: string | null = null;
    response ??= await this.answer(content);
    response ??= await this.handle(message);

    if (!response) await this.chat.sendMessage('No response, try /gpt.help');
    await this.chat.sendMessage(response as string);

    return true;
  }
}
