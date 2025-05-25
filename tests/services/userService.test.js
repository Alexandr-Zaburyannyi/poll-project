/** @format */
const userService = require('../../src/services/userService');

jest.mock('../../src/db/setup', () => {
  const mockPrepare = jest.fn();
  const mockRun = jest.fn();
  const mockGet = jest.fn();

  mockPrepare.mockImplementation(() => ({
    run: mockRun,
    get: mockGet,
  }));

  return {
    prepare: mockPrepare,
  };
});

const db = require('../../src/db/setup');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveUser', () => {
    it('should save a user successfully', () => {
      const mockUser = {
        id: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/pic.jpg',
      };

      const mockReturnedUser = { ...mockUser, created_at: '2025-05-25' };
      db.prepare().get.mockReturnValueOnce(mockReturnedUser);

      const result = userService.saveUser(mockUser);

      expect(db.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users')
      );
      expect(db.prepare().run).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
        mockUser.name,
        mockUser.picture
      );
      expect(result).toEqual(mockReturnedUser);
    });

    it('should handle database errors when saving a user', () => {
      const mockUser = {
        id: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/pic.jpg',
      };

      const mockError = new Error('Database error');
      db.prepare().run.mockImplementation(() => {
        throw mockError;
      });

      expect(() => {
        userService.saveUser(mockUser);
      }).toThrow('Error saving user: Database error');
    });
  });

  describe('getUserById', () => {
    it('should get a user by ID successfully', () => {
      const mockUser = {
        id: 'google123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/pic.jpg',
        created_at: '2025-05-25',
      };

      db.prepare().get.mockReturnValueOnce(mockUser);

      const result = userService.getUserById('google123');

      expect(db.prepare).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?'
      );
      expect(db.prepare().get).toHaveBeenCalledWith('google123');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', () => {
      db.prepare().get.mockReturnValueOnce(null);

      const result = userService.getUserById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors when getting a user', () => {
      const mockError = new Error('Database error');
      db.prepare().get.mockImplementation(() => {
        throw mockError;
      });

      expect(() => {
        userService.getUserById('google123');
      }).toThrow('Error fetching user: Database error');
    });
  });
});
