import fetch from 'node-fetch';
import { OpenAI, toFile } from 'openai';
import { sleep } from 'openai/core';
import { Run } from 'openai/resources/beta/threads/runs/runs';

import { IAgent } from '../types/agent';
import { AgentFunction } from './function';

export class AgentOpenAI implements IAgent {
  protected readonly agentId: string;

  functions: Map<string, AgentFunction> = new Map();

  openai: OpenAI;

  constructor(agentId: string, functions: AgentFunction[] = []) {
    this.openai = new OpenAI();
    this.agentId = agentId;

    for (const fn of functions) {
      this.functions.set(fn.name, fn);
    }
  }

  private async *treatAction(run: Run) {
    const tools = run.required_action.submit_tool_outputs.tool_calls;

    for (const tool of tools) {
      const { name, arguments: args } = tool.function;
      const output = await this.executeFunction(name, JSON.parse(args));

      yield { tool_call_id: tool.id, output };
    }
  }

  private async executeFunction(name: string, args: object[]) {
    const fn = this.functions.get(name);
    if (!fn) throw new Error(`Function ${name} not found`);

    console.log(`Executing function ${name}`);
    return await fn.execute(args);
  }

  private async poolingRun(threadId: string, runId: string): Promise<Run> {
    const response = await this.openai.beta.threads.runs.retrieve(
      threadId,
      runId
    );

    console.log(response.status);

    if (response.status === 'requires_action') {
      let toolOutputs: any[] = [];

      for await (const result of this.treatAction(response)) {
        toolOutputs.push(result);
      }

      await this.openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
        tool_outputs: toolOutputs,
      });
    }

    const isFinished =
      response.status === 'cancelled' ||
      response.status === 'completed' ||
      response.status === 'failed';
    if (!isFinished) {
      await sleep(2000);
      return await this.poolingRun(threadId, runId);
    }

    const hadSuccess = response.status === 'completed';
    if (!hadSuccess) throw new Error(response.last_error?.message);

    return response;
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

  async createAndRunThread(content: string) {
    return await this.openai.beta.threads.createAndRun({
      assistant_id: this.agentId,
      thread: {
        messages: [{ role: 'user', content }],
      },
    });
  }

  async recoverThreadMessage(threadId: string): Promise<string> {
    const response = await this.openai.beta.threads.messages.list(threadId);

    return response.data.flatMap((r) =>
      r.content?.map((c) => (c as any)?.text?.value)
    )[0];
  }

  async complet(msg: string): Promise<string | null> {
    const { thread_id, id } = await this.createAndRunThread(msg);

    const completedRun = await this.poolingRun(thread_id, id);
    const response = await this.recoverThreadMessage(completedRun.thread_id);

    if (!response) return null;
    return response;
  }
}
