import fetch from 'node-fetch';
import { AgentOpenAI } from 's1-agents';
import { toFile } from 'openai';

export class ZapAgent extends AgentOpenAI {
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
}
