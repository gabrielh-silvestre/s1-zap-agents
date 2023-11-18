import { OpenAI } from 'openai';
import { sleep } from 'openai/core.mjs';
import { Run } from 'openai/resources/beta/threads/runs/runs.mjs';

export class Agent {
  protected readonly agentId: string;

  openai: OpenAI;

  constructor(agentId: string) {
    this.openai = new OpenAI();
    this.agentId = agentId;
  }

  private async poolingRun(threadId: string, runId: string): Promise<Run> {
    const response = await this.openai.beta.threads.runs.retrieve(
      threadId,
      runId
    );

    console.log(response.status);

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
