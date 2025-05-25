/** @format */
const pollService = require('../../src/services/pollService');
const db = require('../../src/db/setup');

jest.mock('../../src/db/setup', () => {
  return {
    prepare: jest.fn().mockReturnValue({
      run: jest.fn().mockReturnValue({ lastInsertRowid: 1, changes: 1 }),
      get: jest.fn().mockReturnValue({ id: 1, title: 'Test Poll' }),
      all: jest.fn().mockReturnValue([{ id: 1, title: 'Test Poll' }]),
    }),
  };
});

describe('Simple Integration Tests', () => {
  it('should create a poll successfully', () => {
    const result = pollService.createPoll('Test Poll', 'Test Description');
    expect(result).toEqual({ id: 1 });
    expect(db.prepare).toHaveBeenCalled();
  });
});
