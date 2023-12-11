import { AgentOptions } from 's1-agents';

export type PromptOpts = {
  message: string;
  directives?: string[];
  breakLineSymbol?: string;
};

export type ZapAgentOpts = AgentOptions & {
  prompt?: PromptOpts;
};

export type IZapAgent = {
  /**
   * @param {string} media - Base64 string of audio/ogg
   */
  transcriptAudio(media: Buffer): Promise<string>;
  transcriptText(text: string): Promise<ArrayBuffer>;

  complet(msg: string): Promise<string | null>;
};
