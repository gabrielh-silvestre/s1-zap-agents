import { ChatCompletionMessageParam } from 'openai/resources';
import { AgentOptions } from 's1-agents';

export type PromptOpts = {
  message: string;
  directives?: string[];
  breakLineSymbol?: string;
};

export type CompleteChatOptions = {
  stream?: boolean;
  model?: string;
  maxTokens?: number;
};

export type CompleteImageOptions = {
  image: Buffer;
  mimetype: string;
};

export type ZapAgentOpts = AgentOptions & {
  prompt?: PromptOpts;
  chat?: CompleteChatOptions;
};

export type IZapAgent = {
  /**
   * @param {string} media - Base64 string of audio/ogg
   */
  transcriptAudio(media: Buffer): Promise<string>;
  transcriptText(text: string): Promise<ArrayBuffer>;

  genChat(
    msg: string,
    chatHistory?: ChatCompletionMessageParam[]
  ): AsyncGenerator<string | null>;
  genChatImage(
    msg: string,
    img: CompleteImageOptions,
    chatHistory?: ChatCompletionMessageParam[]
  ): AsyncGenerator<string | null>;
  chatImage(
    msg: string,
    img: CompleteImageOptions,
    chatHistory?: ChatCompletionMessageParam[]
  ): Promise<string | null>;
  chat(
    msg: string,
    chatHistory?: ChatCompletionMessageParam[]
  ): Promise<string | null>;

  complet(msg: string): Promise<string | null>;
};
