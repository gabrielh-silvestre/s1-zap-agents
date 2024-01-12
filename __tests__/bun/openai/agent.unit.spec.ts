import { Mock, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import { ZapAgent } from '../../../src/openai/agent';
import { mockOpenAI } from '../../mocks';

import {
  BREAK_LINE_SYMBOL,
  DEFAULT_DIRECTIVES,
  DEFAULT_PROMPT,
  MAX_GPT_4_VISION_TOKENS,
  STRICT_DIRECTIVE,
} from '../../../src/utils/constants';

import {
  CompleteChatOptions,
  CompleteImageOptions,
  PromptOpts,
} from '../../../src/types/agent';
import { Stream } from 'openai/streaming';
import {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources';

// @ts-ignore
class ZapAgentImp extends ZapAgent {
  transformAudiOggToBlob(buffer: Buffer) {
    // @ts-ignore
    return super.transformAudiOggToBlob(buffer);
  }

  transformImageToBase64(image: Buffer, mimetype: string) {
    // @ts-ignore
    return super.transformImageToBase64(image, mimetype);
  }

  async *proccessStream(stream: Stream<any>) {
    // @ts-ignore
    for await (const chunk of super.proccessStream(stream)) {
      yield chunk;
    }
  }

  async completeChat(
    newMessaage: ChatCompletionUserMessageParam,
    chatHistory?: ChatCompletionMessageParam[],
    opts: CompleteChatOptions = {}
  ) {
    // @ts-ignore
    return super.completeChat(newMessaage, chatHistory, opts);
  }
}

describe('[Unit] Test for ZapAgent', () => {
  let agent: ZapAgent;

  let mockedTranscription: any;
  let mockedSpeech: any;
  let mockedChat: any;

  beforeEach(() => {
    const mockeOpenAI = mockOpenAI();
    agent = new ZapAgentImp({ agentId: '123' }) as any;

    mockedTranscription = mockeOpenAI.audio.transcriptions.create;
    mockedSpeech = mockeOpenAI.audio.speech.create;
    mockedChat = mockeOpenAI.chat.completions.create;

    agent.openai.audio.speech.create = mockedSpeech;
    agent.openai.audio.transcriptions.create = mockedTranscription;
    agent.openai.chat.completions.create = mockedChat;
  });

  it('should be defined', () => {
    expect(agent).toBeDefined();
  });

  describe('new ZapAgent()', () => {
    it('should build directives', () => {
      // Arrange
      const directive = [`test ${new Date().getTime()}`, 'test'];

      // Act
      const buildedDirectives = ZapAgent.buildDirectives(directive);

      // Assert
      expect(buildedDirectives.includes(STRICT_DIRECTIVE)).toBeTruthy();
      expect(buildedDirectives.includes(directive[0])).toBeTruthy();
    });

    it('should build prompt', () => {
      // Arrange
      const prompt = {
        message: 'test',
        directives: ['test'],
        breakLineSymbol: 'test',
      };

      // Act
      const { message } = ZapAgent.buildPrompt(prompt);

      // Assert
      expect(message.includes(prompt.message)).toBeTruthy();
      expect(message.includes(prompt.directives[0])).toBeTruthy();
      expect(message.includes(prompt.breakLineSymbol)).toBeTruthy();
    });

    it('should build prompt with default values', () => {
      // Act
      const opts = ZapAgent.buildChatOpts({
        stream: true,
        model: 'test',
        maxTokens: 42,
      });

      // Assert
      expect(opts.stream).toBeTruthy();
      expect(opts.model).toBe('test');
      expect(opts.maxTokens).toBe(undefined); // Max tokens is only available for "chat" methods
    });

    it('should build agent with default values', () => {
      // Act
      const agent = new ZapAgent({ agentId: '123' });

      // Assert
      expect(agent.prompt).toBeDefined();
      expect(agent.prompt).toContain(STRICT_DIRECTIVE);
      expect(agent.prompt).toContain(BREAK_LINE_SYMBOL);
      expect(agent.prompt).toContain(DEFAULT_PROMPT);
      expect(
        DEFAULT_DIRECTIVES().every((d) => agent.prompt.includes(d))
      ).toBeTruthy();
    });

    it('should build agent with custom values', () => {
      // Arrange
      const prompt: PromptOpts = {
        message: 'test',
        directives: ['test'],
        breakLineSymbol: 'test',
      };

      const chat: CompleteChatOptions = {
        maxTokens: 42,
        model: 'test',
        stream: true,
      };

      // Act
      const agent = new ZapAgent({
        agentId: '123',
        prompt,
        chat,
      });

      // Assert
      expect(agent.prompt).toBeDefined();
      expect(agent.prompt).toContain(STRICT_DIRECTIVE);
      expect(agent.prompt).toContain(prompt.breakLineSymbol);
      expect(agent.prompt).toContain(prompt.message);
      expect(
        prompt?.directives?.every((d) => agent.prompt.includes(d))
      ).toBeTruthy();
    });
  });

  describe('.prompt', () => {
    it('should return prompt', () => {
      // Arrange
      const prompt = 'test';

      // Act
      const agent = new ZapAgent({
        agentId: '123',
        prompt: { message: prompt },
      });

      // Assert
      expect(agent.prompt).toContain(prompt);
    });
  });

  describe('.clearChat', () => {
    it('should clear chat', async () => {
      // Arrange
      await agent.chat('test');
      const prevHistory = agent.chatHistory;

      // Act
      agent.clearChat();

      // Assert
      expect(prevHistory).toHaveLength(1);
      expect(agent.chatHistory).toHaveLength(0);
    });
  });

  describe('.transcriptAudio', () => {
    it('should transcribe audio to text', async () => {
      // Arrange
      agent.openai.audio.transcriptions.create = mockedTranscription;
      const audio = Buffer.from('test');

      // Act
      await agent.transcriptAudio(audio);

      // Assert
      expect(mockedTranscription).toHaveBeenCalled();
    });
  });

  describe('.transcriptText', () => {
    it('should transcript text to audio', async () => {
      // Arrange
      const text = 'test';

      // Act
      await agent.transcriptText(text);

      // Assert
      expect(mockedSpeech).toHaveBeenCalled();
    });
  });

  describe('generator methods', () => {
    let mockedStreamOpenAI: any;
    let mockedStreamAgent: any;

    let spyTransformImage: Mock<any>;
    let spyCompleteChat: Mock<any>;
    let spyProccessStream: Mock<any>;

    beforeEach(() => {
      mockedStreamOpenAI = mockOpenAI('stream');
      mockedStreamAgent = new ZapAgentImp({ agentId: '123' });

      mockedStreamAgent.openai.chat.completions.create =
        mockedStreamOpenAI.chat.completions.create;

      spyTransformImage = spyOn(mockedStreamAgent, 'transformImageToBase64');
      spyCompleteChat = spyOn(mockedStreamAgent, 'completeChat');
      spyProccessStream = spyOn(mockedStreamAgent, 'proccessStream');
    });

    it('.genChatImage should chat on-demand using image', async () => {
      // Arrange
      const completeImgOpts: CompleteImageOptions = {
        image: Buffer.from([0, 1, 2, 3]),
        mimetype: 'image/png',
      };

      // Act
      for await (const res of mockedStreamAgent.genChatImage(
        'test',
        completeImgOpts
      )) {
        expect(res).toBeDefined();
      }

      // Assert
      expect(spyTransformImage).toHaveBeenCalled();
      expect(spyTransformImage.mock.calls[0]).toEqual([
        expect.any(Buffer),
        completeImgOpts.mimetype,
      ]);

      expect(spyCompleteChat).toHaveBeenCalled();
      expect(spyCompleteChat.mock.calls[0]).toEqual([
        expect.objectContaining({
          role: 'user',
          content: expect.arrayContaining([
            expect.objectContaining({
              image_url: expect.objectContaining({
                url: expect.any(String),
                detail: 'auto',
              }),
            }),
            expect.objectContaining({
              text: expect.any(String),
            }),
          ]),
        }),
        undefined,
        {
          maxTokens: MAX_GPT_4_VISION_TOKENS,
          model: 'gpt-4-vision-preview', // OpenAI model to interpret images
          stream: true,
        },
      ]);

      expect(spyProccessStream).toHaveBeenCalled();
      // Messages with images are not stored in chat history
      expect(mockedStreamAgent.chatHistory).toHaveLength(0);
    });

    it('.genChat should chat on-demand', async () => {
      // Act
      for await (const res of mockedStreamAgent.genChat('test')) {
        expect(res).toBeDefined();
      }

      // Assert
      expect(spyCompleteChat).toHaveBeenCalled();
      expect(spyCompleteChat.mock.calls[0]).toEqual([
        expect.objectContaining({
          role: 'user',
          content: 'test',
        }),
        undefined,
        {
          stream: true,
        },
      ]);

      expect(spyProccessStream).toHaveBeenCalled();
      expect(mockedStreamAgent.chatHistory).toHaveLength(1);
    });
  });

  describe('.chat', () => {
    it('should chat', async () => {
      // Arrange
      const text = 'test';

      // Act
      await agent.chat(text);

      // Assert
      expect(mockedChat).toHaveBeenCalled();
      expect(agent.chatHistory).toHaveLength(1);
    });
  });

  describe('.chatImage', () => {
    it('should chat with image', async () => {
      // Arrange
      const text = 'test';
      const image = Buffer.from([0, 1, 2, 3]);
      const mimetype = 'image/png';

      // Act
      await agent.chatImage(text, { image, mimetype });

      // Assert
      expect(mockedChat).toHaveBeenCalled();
      // Messages with images are not stored in chat history
      expect(agent.chatHistory).toHaveLength(0);
    });
  });
});
