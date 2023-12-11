import fetch from 'node-fetch';
import { AgentOpenAI } from 's1-agents';
import { toFile } from 'openai';
import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources';

import {
  CompleteChatOptions,
  CompleteImageOptions,
  IZapAgent,
  PromptOpts,
  ZapAgentOpts,
} from '../types/agent';

import {
  BREAK_LINE_REGEX,
  BREAK_LINE_SYMBOL,
  DEFAULT_DIRECTIVES,
  DEFAULT_PROMPT,
  MAX_GPT_4_VISION_TOKENS,
} from '../utils/constants';
import { Stream } from 'openai/streaming';

export class ZapAgent extends AgentOpenAI implements IZapAgent {
  private _prompt: PromptOpts;
  private _chat: CompleteChatOptions;

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

  static buildChatOpts(chat: CompleteChatOptions): CompleteChatOptions {
    return {
      stream: chat?.stream ?? false,
      model: chat?.model ?? 'gpt-4-1106-preview',
    };
  }

  constructor(opts: ZapAgentOpts) {
    super(opts);

    this._prompt = ZapAgent.buildPrompt(opts.prompt);
    this._chat = ZapAgent.buildChatOpts(opts.chat);
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

  private transformImageToBase64(image: Buffer, mimetype: string): string {
    return `data:${mimetype};base64,${image.toString('base64')}`;
  }

  private async *proccessStream(stream: Stream<ChatCompletionChunk>) {
    let response: string = '';

    for await (const chunk of stream) {
      const finishReason = chunk.choices[0]?.finish_reason;
      if (finishReason === 'stop' || finishReason === 'length') {
        const responseHasContent = response.trim().length > 0;
        if (responseHasContent) yield response.trim();

        break;
      }

      const content = chunk.choices[0]?.delta?.content;
      if (content) response += content;

      const isBreakLine = BREAK_LINE_REGEX(response);
      if (isBreakLine) {
        const [before, ...after] = response.split(BREAK_LINE_SYMBOL);
        yield before;

        response = after.join('');
      }
    }

    yield response.trim();
  }

  private async completeChat(
    newMessage: ChatCompletionUserMessageParam,
    chatHistory?: ChatCompletionMessageParam[],
    opts: CompleteChatOptions = {}
  ) {
    const stream = opts.stream ?? this._chat.stream;
    const model = opts.model ?? this._chat.model;

    const prevMessages = chatHistory ?? this._currChat;
    return this.openai.chat.completions.create({
      model,
      stream,
      max_tokens: opts.maxTokens,
      messages: [
        { role: 'system', content: this.prompt },
        ...prevMessages,
        newMessage,
      ],
    });
  }

  async *genChatImage(
    text: string,
    { image, mimetype }: CompleteImageOptions,
    chatHistory?: ChatCompletionMessageParam[]
  ) {
    const url = this.transformImageToBase64(image, mimetype);
    const newMsg: ChatCompletionUserMessageParam = {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url, detail: 'auto' } },
        { type: 'text', text },
      ],
    };

    const stream = (await this.completeChat(newMsg, chatHistory, {
      stream: true,
      model: 'gpt-4-vision-preview',
      maxTokens: MAX_GPT_4_VISION_TOKENS,
    })) as Stream<ChatCompletionChunk>;

    for await (const chunk of this.proccessStream(stream)) {
      yield chunk;
    }

    this._currChat.push(newMsg);
  }

  async *genChat(text: string, chatHistory?: ChatCompletionMessageParam[]) {
    const newMsg: ChatCompletionUserMessageParam = {
      role: 'user',
      content: text,
    };
    const stream = (await this.completeChat(newMsg, chatHistory, {
      stream: true,
    })) as Stream<ChatCompletionChunk>;

    for await (const chunk of this.proccessStream(stream)) {
      yield chunk;
    }

    this._currChat.push(newMsg);
  }

  async chatImage(
    text: string,
    { image, mimetype }: CompleteImageOptions,
    chatHistory?: ChatCompletionMessageParam[]
  ) {
    const url = this.transformImageToBase64(image, mimetype);
    const newMsg: ChatCompletionUserMessageParam = {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url, detail: 'auto' } },
        { type: 'text', text },
      ],
    };

    const response = (await this.completeChat(newMsg, chatHistory, {
      model: 'gpt-4-vision-preview',
      maxTokens: MAX_GPT_4_VISION_TOKENS,
    })) as ChatCompletion;

    this._currChat.push(newMsg);
    return response.choices[0]?.message?.content;
  }

  async chat(text: string, chatHistory?: ChatCompletionMessageParam[]) {
    const newMsg: ChatCompletionUserMessageParam = {
      role: 'user',
      content: text,
    };
    const response = (await this.completeChat(
      newMsg,
      chatHistory
    )) as ChatCompletion;

    this._currChat.push(newMsg);
    return response.choices[0]?.message?.content;
  }
}
