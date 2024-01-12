import { Chat, Message } from 'whatsapp-web.js';

import { ZapAgentOpts } from '../types/agent';
import { HandlerOpts, StartAgentMode } from '../types/handlers';

import { ZapAgent } from '../openai/agent';

import { GPT_MSG_IDENTIFIER } from '../utils/constants';

export abstract class BaseHandler {
  protected command: string | null = null;

  protected agent: ZapAgent | null = null;

  protected agents: Map<string, ZapAgent> = new Map();

  name: string = 'BASE';

  static buildOpts(opts?: HandlerOpts): HandlerOpts {
    return { agent: null, command: null, ...opts }
  }

  constructor(opts?: HandlerOpts) {
    const { agent, command } = BaseHandler.buildOpts(opts);
    this.agent = agent ?? null;

    const isCommandString = typeof command === 'string';
    if (isCommandString) {
      this.command = command;
      this.name = command ?? this.name;
    }
  }

  /**
 * @param opts - Options to create the agent
 * @param mode - Mode to start the agent, default is SAFE
 * @param id - Unique identifier to recover the specific agent
 * 
 * @description
 * Only use this method if you have multiple agents, otherwise use the constructor
 * to set the agent
 * 
 * Modes:
 * - StartAgentMode.Safe: If the agent already exists, it will not be created
 * - StartAgentMode.Override: If the agent already exists, it will be deleted and created again
 * - StartAgentMode.Throw: If the agent already exists, it will throw an error
 */
  protected startAgent(
    opts: ZapAgentOpts,
    mode: StartAgentMode = StartAgentMode.Safe,
    id?: string
  ): void {
    const agent = new ZapAgent(opts);
    const agentId = id ?? opts.agentId;

    if (this.agents.has(agentId)) {
      switch (mode) {
        case StartAgentMode.Safe:
          return;
        case StartAgentMode.Override:
          this.agents.delete(agentId);
          break;
        case StartAgentMode.Throw:
          throw new Error(`Agent ${agentId} already exists`);
      }
    };

    this.agents.set(agentId, agent);
  }

  /**
   * @param id - Unique identifier to recover the specific agent
   */
  protected deleteAgent(id: string): void {
    const agentId = this.agent?.props.agentId ?? id;

    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent ${agentId} does not exists`);

    this.agents.delete(agentId);
    this.agent = null;
  }

  /**
   * @param id - Unique identifier to recover the specific agent
   * 
   * @description
   * Only use this method if you have multiple agents, otherwise use the constructor
   * to set the agent
   */
  protected useAgent(id: string): void {
    const agent = this.agents.get(id);
    if (!agent) throw new Error(`Agent ${id} does not exists`);

    this.agent = agent;
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

  abstract shouldExecute(msg: Message): Promise<boolean>;

  async answer(chat: Chat, msg: string): Promise<boolean | null> {
    return null;
  }

  async handle(chat: Chat, msg: Message): Promise<boolean | null> {
    return null;
  }

  async answerQuoted(chat: Chat, msg: string): Promise<boolean | null> {
    return null;
  }

  async handleQuoted(chat: Chat, msg: Message): Promise<boolean | null> {
    return null;
  }

  private async getResponse(chat: Chat, msg: Message): Promise<boolean> {
    let response: boolean | null = null;
    if (msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();

      response ??= await this.handleQuoted(chat, quotedMsg);
      response ??= await this.answerQuoted(chat, quotedMsg.body);
    } else {
      const content = msg.body && this.command
        ? msg.body.replace(this.command, '').trim()
        : msg.body;

      response ??= await this.handle(chat, msg);
      response ??= await this.answer(chat, content);
    }

    return response;
  }

  async execute(message: Message): Promise<boolean> {
    console.log(`[${this.name}] Executing...`);
    const chat = await message.getChat();

    try {
      await this.startExec(message);
      const response = await this.getResponse(chat, message);

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
