import fetch from 'node-fetch';
import { AgentOpenAI } from 's1-agents';
import { toFile } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

import { PromptOpts, ZapAgentOpts } from '../types/agent';

import {
  BREAK_LINE_REGEX,
  BREAK_LINE_SYMBOL,
  DEFAULT_DIRECTIVES,
  DEFAULT_PROMPT,
} from '../utils/constants';

export class ZapAgent extends AgentOpenAI {
  private _prompt: PromptOpts;

  private _currChat: ChatCompletionMessageParam[] = [];

  static buildDirectives(directives: string[]) {
    const list = directives
      .map((directive) => `* IMPORTANT ${directive}`)
      .join('\n');

    return `# STRICT DIRECTIVES\n${list}`;
  }

  /**
   * Builds a prompt object with optional properties.
   * If any property is not provided, default values will be used.
   * @param prompt - The prompt options.
   * @returns The built prompt object.
   */
  static buildPrompt(prompt: PromptOpts): PromptOpts {
    const message = prompt?.message ?? DEFAULT_PROMPT;
    const breakLineSymbol = prompt?.breakLineSymbol ?? BREAK_LINE_SYMBOL;
    const directives = prompt?.directives
      ? [...prompt.directives, ...DEFAULT_DIRECTIVES(breakLineSymbol)]
      : DEFAULT_DIRECTIVES(breakLineSymbol);

    return {
      message: `${message}\n${ZapAgent.buildDirectives(directives)}`,
      breakLineSymbol,
      directives,
    };
  }

  constructor(opts: ZapAgentOpts) {
    super(opts);

    this._prompt = ZapAgent.buildPrompt(opts.prompt);
  }

  get prompt(): string {
    return this._prompt.message;
  }

  clearChat() {
    this._currChat.length = 0;
  }

  private async transformAudiOggToBlob(buffer: Buffer) {
    const dataUrl = `data:audio/ogg;base64,${buffer.toString('base64')}`;

    const response = await fetch(dataUrl);
    return await response.blob();
  }

  async transcriptAudio(media: Buffer) {
    const blob = await this.transformAudiOggToBlob(media);
    const file = await toFile(blob, 'audio.ogg', { type: 'audio/ogg' });

    const transcription = await this.openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      temperature: 0.6,
    });

    return transcription.text;
  }

  async transcriptText(text: string) {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1',
      input: text,
      voice: 'alloy',
      response_format: 'opus',
    });

    return response.arrayBuffer();
  }

  async *genChat(text: string, chatHistory?: ChatCompletionMessageParam[]) {
    let response: string = '';

    const prevMessages = chatHistory ?? this._currChat;
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: this.prompt },
        ...prevMessages,
        { role: 'user', content: text },
      ],
      stream: true,
    });

    this._currChat.push({ role: 'user', content: text });

    for await (const chunk of stream) {
      if (chunk.choices[0].finish_reason === 'stop') {
        const responseHasContent = response.trim().length > 0;
        if (responseHasContent) yield response.trim();

        break;
      }

      const content = chunk.choices[0]?.delta?.content;
      response += content;

      const isBreakLine = BREAK_LINE_REGEX(response);
      if (isBreakLine) {
        const [before, ...after] = response.split(BREAK_LINE_SYMBOL);
        yield before;

        response = after.join('');
      }
    }
  }

  async chat(text: string, chatHistory?: ChatCompletionMessageParam[]) {
    const prevMessages = chatHistory ?? this._currChat;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: this.prompt },
        ...prevMessages,
        { role: 'user', content: text },
      ],
    });

    this._currChat.push({ role: 'user', content: text });
    return response.choices[0]?.message?.content;
  }
}
