import { afterEach, beforeAll, jest } from 'bun:test';

beforeAll(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
