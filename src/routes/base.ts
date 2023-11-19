import { Chat, Message } from 'whatsapp-web.js';
import { Agent } from '../openai/agent';

export abstract class RouteBase {
  readonly command: string;

  readonly chat: Chat;

  protected readonly agent: Agent;

  constructor(command: string, chat: Chat, agent: Agent) {
    this.command = '/gpt'.concat(`.${command}`);
    this.chat = chat;
    this.agent = agent;
  }

  protected shouldExecute(message: Message): boolean {
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

    const content = message.body.replace(this.command, '').trim();

    let response: string | null = null;
    response ??= await this.answer(content);
    response ??= await this.handle(message);

    if (!response) await this.chat.sendMessage('No response, try /gpt.help');
    await this.chat.sendMessage(response as string);

    return true;
  }
}
