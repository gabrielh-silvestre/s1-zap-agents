export type IAgent = {
  /**
   * @param {string} media - Base64 string of audio/ogg
   */
  transcriptAudio(media: Buffer): Promise<string>;
  transcriptText(text: string): Promise<ArrayBuffer>;

  complet(msg: string): Promise<string | null>;
};
