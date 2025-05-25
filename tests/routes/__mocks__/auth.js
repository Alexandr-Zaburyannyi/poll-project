/** @format */

// Mock auth middleware for route tests
jest.mock('../../src/middleware/auth', () => ({
  isAuthenticated: (req, res, next) => {
    // Mock user object to simulate authentication
    req.user = {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    };
    return next();
  },
}));
