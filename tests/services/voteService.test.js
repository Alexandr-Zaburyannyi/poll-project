/** @format */
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

  const db = {
    prepare: mockPrepare,
  };

  return db;
});

const db = require('../../src/db/setup');

describe('VoteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createVote', () => {
    it('should create a vote and return its id', () => {
      const mockRunResult = { lastInsertRowid: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = voteService.createVote(1, 'user123');

      expect(db.prepare).toHaveBeenCalledWith(
        'INSERT INTO votes (option_id, voter_id) VALUES (?, ?)'
      );

      expect(db.prepare().run).toHaveBeenCalledWith(1, 'user123');

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('getAllVotes', () => {
    it('should return all votes', () => {
      const mockVotes = [
        {
          id: 1,
          option_id: 1,
          voter_id: 'user123',
          voted_at: '2025-05-25 12:00:00',
        },
        {
          id: 2,
          option_id: 2,
          voter_id: 'user456',
          voted_at: '2025-05-25 12:30:00',
        },
      ];
      db.prepare().all.mockReturnValue(mockVotes);

      const result = voteService.getAllVotes();

      expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM votes');

      expect(db.prepare().all).toHaveBeenCalled();

      expect(result).toEqual(mockVotes);
    });
  });

  describe('getVoteById', () => {
    it('should return a vote by id', () => {
      const mockVote = {
        id: 1,
        option_id: 1,
        voter_id: 'user123',
        voted_at: '2025-05-25 12:00:00',
      };
      db.prepare().get.mockReturnValue(mockVote);

      const result = voteService.getVoteById(1);

      expect(db.prepare).toHaveBeenCalledWith(
        'SELECT * FROM votes WHERE id = ?'
      );

      expect(db.prepare().get).toHaveBeenCalledWith(1);

      expect(result).toEqual(mockVote);
    });
  });

  describe('updateVote', () => {
    it('should update a vote and return success status', () => {
      const mockRunResult = { changes: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = voteService.updateVote(1, 2, 'user789');

      expect(db.prepare).toHaveBeenCalledWith(
        'UPDATE votes SET option_id = ?, voter_id = ? WHERE id = ?'
      );

      expect(db.prepare().run).toHaveBeenCalledWith(2, 'user789', 1);

      expect(result).toEqual({ updated: true });
    });

    it('should return updated: false when no rows are affected', () => {
      const mockRunResult = { changes: 0 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = voteService.updateVote(999, 2, 'user789');

      expect(result).toEqual({ updated: false });
    });
  });

  describe('deleteVote', () => {
    it('should delete a vote and return success status', () => {
      const mockRunResult = { changes: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = voteService.deleteVote(1);

      expect(db.prepare).toHaveBeenCalledWith('DELETE FROM votes WHERE id = ?');

      expect(db.prepare().run).toHaveBeenCalledWith(1);

      expect(result).toEqual({ deleted: true });
    });

    it('should return deleted: false when no rows are affected', () => {
      const mockRunResult = { changes: 0 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = voteService.deleteVote(999);

      expect(result).toEqual({ deleted: false });
    });
  });
});
