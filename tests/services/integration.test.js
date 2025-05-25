/** @format */
const pollService = require('../../src/services/pollService');
const optionService = require('../../src/services/optionService');
const voteService = require('../../src/services/voteService');

jest.mock('../../src/db/setup', () => {
  const mockPrepare = jest.fn();
  const mockRun = jest.fn();
  const mockGet = jest.fn();
  const mockAll = jest.fn();

  mockPrepare.mockImplementation(() => ({
    run: mockRun,
    get: mockGet,
    all: mockAll,
  }));

  return {
    prepare: mockPrepare,
  };
});

const db = require('../../src/db/setup');

describe('Advanced Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a poll with options and votes', () => {
    const mockPollResult = { lastInsertRowid: 1 };
    const mockOption1Result = { lastInsertRowid: 1 };
    const mockOption2Result = { lastInsertRowid: 2 };
    const mockVoteResult = { lastInsertRowid: 1 };

    db.prepare().run.mockReturnValueOnce(mockPollResult);
    db.prepare().run.mockReturnValueOnce(mockOption1Result);
    db.prepare().run.mockReturnValueOnce(mockOption2Result);
    db.prepare().run.mockReturnValueOnce(mockVoteResult);

    const mockPollData = {
      id: 1,
      title: 'Test Poll',
      description: 'Test Description',
      is_active: 1,
    };
    db.prepare().get.mockReturnValueOnce(mockPollData);

    const mockOptionsData = [
      { id: 1, poll_id: 1, text: 'Option 1' },
      { id: 2, poll_id: 1, text: 'Option 2' },
    ];
    db.prepare().all.mockReturnValueOnce(mockOptionsData);

    const mockVotesData = [{ id: 1, option_id: 1, voter_id: 'user123' }];
    db.prepare().all.mockReturnValueOnce(mockVotesData);

    const pollResult = pollService.createPoll('Test Poll', 'Test Description');
    expect(pollResult).toEqual({ id: 1 });
    expect(db.prepare).toHaveBeenCalledWith(
      'INSERT INTO polls (title, description, is_active) VALUES (?, ?, ?)'
    );

    const option1Result = optionService.createOption(pollResult.id, 'Option 1');
    const option2Result = optionService.createOption(pollResult.id, 'Option 2');
    expect(option1Result).toEqual({ id: 1 });
    expect(option2Result).toEqual({ id: 2 });

    const voteResult = voteService.createVote(option1Result.id, 'user123');
    expect(voteResult).toEqual({ id: 1 });

    const poll = pollService.getPollById(pollResult.id);
    expect(poll).toEqual(mockPollData);

    const options = optionService.getAllOptions();
    expect(options).toEqual(mockOptionsData);

    const votes = voteService.getAllVotes();
    expect(votes).toEqual(mockVotesData);
  });

  it('should handle database errors when creating a poll', () => {
    const mockError = new Error('Database error');
    db.prepare().run.mockImplementation(() => {
      throw mockError;
    });

    expect(() => {
      pollService.createPoll('Test Poll', 'Test Description');
    }).toThrow('Database error');
  });

  it('should handle the complete lifecycle of a poll', () => {
    db.prepare().run.mockReturnValueOnce({ lastInsertRowid: 1 });

    db.prepare().run.mockReturnValueOnce({ changes: 1 });

    const mockUpdatedPoll = {
      id: 1,
      title: 'Updated Poll',
      description: 'Updated Description',
      is_active: 0,
    };
    db.prepare().get.mockReturnValueOnce(mockUpdatedPoll);

    db.prepare().run.mockReturnValueOnce({ changes: 1 });

    const pollResult = pollService.createPoll('Test Poll', 'Test Description');
    expect(pollResult).toEqual({ id: 1 });

    const updateResult = pollService.updatePoll(
      pollResult.id,
      'Updated Poll',
      'Updated Description',
      0
    );
    expect(updateResult).toEqual({ updated: true });

    const updatedPoll = pollService.getPollById(pollResult.id);
    expect(updatedPoll).toEqual(mockUpdatedPoll);

    const deleteResult = pollService.deletePoll(pollResult.id);
    expect(deleteResult).toEqual({ deleted: true });
  });
});
