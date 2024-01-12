import { afterEach, beforeEach, jest, mock } from 'bun:test';
import OpenAI from 'openai';

import { mockOpenAI } from '../mocks';

beforeEach(() => {
  mock.module('openai', () => ({
    ...OpenAI,
    OpenAI: mock(() => mockOpenAI()),
  }));
});

afterEach(() => {
  jest.restoreAllMocks();
});
