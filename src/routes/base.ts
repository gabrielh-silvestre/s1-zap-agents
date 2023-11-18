import { openai } from '../gpt';
import { Chat, Message } from 'whatsapp-web.js';

export abstract class RouteBase {
  readonly command: string;

  readonly chat: Chat;

  protected readonly openai = openai;

  constructor(command: string, chat: Chat) {
    this.command = '/gpt'.concat(`.${command}`);
    this.chat = chat;
  }

  private shouldExecute(message: Message): boolean {
    return message.body.startsWith(this.command);
  }

  async answer(_: string): Promise<string | null> {
    return null;
  }

  async handle(_: Message): Promise<string | null> {
    return null;
  }

  protected async sendToGPT(
    message: string,
    prompt: string = ''
  ): Promise<string | null> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: message },
      ],
    });

    return completion.choices[0].message?.content;
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
