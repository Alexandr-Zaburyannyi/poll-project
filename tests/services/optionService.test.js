/** @format */
const optionService = require('../../src/services/optionService');

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

describe('OptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOption', () => {
    it('should create an option and return its id', () => {
      const mockRunResult = { lastInsertRowid: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = optionService.createOption(1, 'Test Option');

      expect(db.prepare).toHaveBeenCalledWith(
        'INSERT INTO options (poll_id, text) VALUES (?, ?)'
      );

      expect(db.prepare().run).toHaveBeenCalledWith(1, 'Test Option');

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('getAllOptions', () => {
    it('should return all options', () => {
      const mockOptions = [
        { id: 1, poll_id: 1, text: 'Option 1' },
        { id: 2, poll_id: 1, text: 'Option 2' },
      ];
      db.prepare().all.mockReturnValue(mockOptions);

      const result = optionService.getAllOptions();

      expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM options');

      expect(db.prepare().all).toHaveBeenCalled();

      expect(result).toEqual(mockOptions);
    });
  });

  describe('getOptionById', () => {
    it('should return an option by id', () => {
      const mockOption = { id: 1, poll_id: 1, text: 'Option 1' };
      db.prepare().get.mockReturnValue(mockOption);

      const result = optionService.getOptionById(1);

      expect(db.prepare).toHaveBeenCalledWith(
        'SELECT * FROM options WHERE id = ?'
      );

      expect(db.prepare().get).toHaveBeenCalledWith(1);

      expect(result).toEqual(mockOption);
    });
  });

  describe('updateOption', () => {
    it('should update an option and return success status', () => {
      const mockRunResult = { changes: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = optionService.updateOption(1, 2, 'Updated Option');

      expect(db.prepare).toHaveBeenCalledWith(
        'UPDATE options SET poll_id = ?, text = ? WHERE id = ?'
      );

      expect(db.prepare().run).toHaveBeenCalledWith(2, 'Updated Option', 1);

      expect(result).toEqual({ updated: true });
    });

    it('should return updated: false when no rows are affected', () => {
      const mockRunResult = { changes: 0 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = optionService.updateOption(999, 2, 'Updated Option');

      expect(result).toEqual({ updated: false });
    });
  });

  describe('deleteOption', () => {
    it('should delete an option and return success status', () => {
      const mockRunResult = { changes: 1 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = optionService.deleteOption(1);

      expect(db.prepare).toHaveBeenCalledWith(
        'DELETE FROM options WHERE id = ?'
      );

      expect(db.prepare().run).toHaveBeenCalledWith(1);

      expect(result).toEqual({ deleted: true });
    });

    it('should return deleted: false when no rows are affected', () => {
      const mockRunResult = { changes: 0 };
      db.prepare().run.mockReturnValue(mockRunResult);

      const result = optionService.deleteOption(999);

      expect(result).toEqual({ deleted: false });
    });
  });
});
