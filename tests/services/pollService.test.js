/** @format */
const pollService = require('../../src/services/pollService');

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

describe('PollService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPoll', () => {
    it('should create a poll and return its id', () => {
      const mockRunResult = { lastInsertRowid: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = pollService.createPoll('Test Poll', 'Test Description', 1);

      expect(db.prepare).toHaveBeenCalledWith(
        'INSERT INTO polls (title, description, is_active) VALUES (?, ?, ?)'
      );

      expect(db.prepare().run).toHaveBeenCalledWith(
        'Test Poll',
        'Test Description',
        1
      );

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('getAllPolls', () => {
    it('should return all polls', () => {
      const mockPolls = [
        { id: 1, title: 'Poll 1', description: 'Description 1', is_active: 1 },
        { id: 2, title: 'Poll 2', description: 'Description 2', is_active: 1 },
      ];
      db.prepare().all.mockReturnValue(mockPolls);

      const result = pollService.getAllPolls();

      expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM polls');

      expect(db.prepare().all).toHaveBeenCalled();

      expect(result).toEqual(mockPolls);
    });
  });

  describe('getPollById', () => {
    it('should return a poll by id', () => {
      const mockPoll = {
        id: 1,
        title: 'Poll 1',
        description: 'Description 1',
        is_active: 1,
      };
      db.prepare().get.mockReturnValue(mockPoll);

      const result = pollService.getPollById(1);

      expect(db.prepare).toHaveBeenCalledWith(
        'SELECT * FROM polls WHERE id = ?'
      );

      expect(db.prepare().get).toHaveBeenCalledWith(1);

      expect(result).toEqual(mockPoll);
    });
  });

  describe('updatePoll', () => {
    it('should update a poll and return success status', () => {
      const mockRunResult = { changes: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = pollService.updatePoll(
        1,
        'Updated Poll',
        'Updated Description',
        0
      );

      expect(db.prepare).toHaveBeenCalledWith(
        'UPDATE polls SET title = ?, description = ?, is_active = ? WHERE id = ?'
      );

      expect(db.prepare().run).toHaveBeenCalledWith(
        'Updated Poll',
        'Updated Description',
        0,
        1
      );

      expect(result).toEqual({ updated: true });
    });

    it('should return updated: false when no rows are affected', () => {
      const mockRunResult = { changes: 0 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = pollService.updatePoll(
        999,
        'Updated Poll',
        'Updated Description',
        0
      );

      expect(result).toEqual({ updated: false });
    });
  });

  describe('deletePoll', () => {
    it('should delete a poll and return success status', () => {
      const mockRunResult = { changes: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = pollService.deletePoll(1);

      expect(db.prepare).toHaveBeenCalledWith('DELETE FROM polls WHERE id = ?');

      expect(db.prepare().run).toHaveBeenCalledWith(1);

      expect(result).toEqual({ deleted: true });
    });

    it('should return deleted: false when no rows are affected', () => {
      const mockRunResult = { changes: 0 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = pollService.deletePoll(999);

      expect(result).toEqual({ deleted: false });
    });
  });
});
