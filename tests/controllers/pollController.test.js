/** @format */
const pollController = require('../../src/controllers/pollController');
const pollService = require('../../src/services/pollService');

jest.mock('../../src/services/pollService');

describe('PollController', () => {
  let mockRequest;
  let mockResponse;
  let responseObject;

  beforeEach(() => {
    responseObject = {};

    mockRequest = {
      body: {},
      params: {},
      user: {
        id: 'test-user-id',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a poll and return 201 status', () => {
      mockRequest.body = {
        title: 'New Poll',
        description: 'Description',
        is_active: 1,
      };
      pollService.createPoll.mockReturnValue({ id: 1 });

      pollController.create(mockRequest, mockResponse);

      expect(pollService.createPoll).toHaveBeenCalledWith(
        'New Poll',
        'Description',
        1,
        'test-user-id'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.body = { title: 'New Poll', description: 'Description' };
      const error = new Error('Database error');
      pollService.createPoll.mockImplementation(() => {
        throw error;
      });

      pollController.create(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getAll', () => {
    it('should return all polls with 200 status', () => {
      const mockPolls = [
        { id: 1, title: 'Poll 1', description: 'Description 1', is_active: 1 },
        { id: 2, title: 'Poll 2', description: 'Description 2', is_active: 1 },
      ];
      pollService.getAllPolls.mockReturnValue(mockPolls);

      pollController.getAll(mockRequest, mockResponse);

      expect(pollService.getAllPolls).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockPolls);
    });

    it('should handle errors and return 500 status', () => {
      const error = new Error('Database error');
      pollService.getAllPolls.mockImplementation(() => {
        throw error;
      });

      pollController.getAll(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getById', () => {
    it('should return a poll by id with 200 status', () => {
      mockRequest.params.id = '1';
      const mockPoll = {
        id: 1,
        title: 'Poll 1',
        description: 'Description 1',
        is_active: 1,
      };
      pollService.getPollById.mockReturnValue(mockPoll);

      pollController.getById(mockRequest, mockResponse);

      expect(pollService.getPollById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockPoll);
    });

    it('should return 404 if poll is not found', () => {
      mockRequest.params.id = '999';
      pollService.getPollById.mockReturnValue(null);

      pollController.getById(mockRequest, mockResponse);

      expect(pollService.getPollById).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Poll not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      const error = new Error('Database error');
      pollService.getPollById.mockImplementation(() => {
        throw error;
      });

      pollController.getById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('update', () => {
    it('should update a poll and return success status', () => {
      mockRequest.params.id = '1';
      mockRequest.body = {
        title: 'Updated Poll',
        description: 'Updated Description',
        is_active: 0,
      };

      pollService.getPollById.mockReturnValue({
        id: 1,
        created_by: 'test-user-id',
      });
      pollService.updatePoll.mockReturnValue({ updated: true });

      pollController.update(mockRequest, mockResponse);

      expect(pollService.getPollById).toHaveBeenCalledWith('1');
      expect(pollService.updatePoll).toHaveBeenCalledWith(
        '1',
        'Updated Poll',
        'Updated Description',
        0
      );
      expect(mockResponse.json).toHaveBeenCalledWith({ updated: true });
    });

    it('should return 404 if poll to update is not found', () => {
      mockRequest.params.id = '999';
      mockRequest.body = {
        title: 'Updated Poll',
        description: 'Updated Description',
        is_active: 0,
      };
      pollService.getPollById.mockReturnValue(null);

      pollController.update(mockRequest, mockResponse);

      expect(pollService.getPollById).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Poll not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      mockRequest.body = {
        title: 'Updated Poll',
        description: 'Updated Description',
        is_active: 0,
      };
      const error = new Error('Database error');
      pollService.getPollById.mockImplementation(() => {
        throw error;
      });

      pollController.update(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('delete', () => {
    it('should delete a poll and return success status', () => {
      mockRequest.params.id = '1';
      pollService.getPollById.mockReturnValue({
        id: 1,
        created_by: 'test-user-id',
      });
      pollService.deletePoll.mockReturnValue({ deleted: true });

      pollController.delete(mockRequest, mockResponse);

      expect(pollService.getPollById).toHaveBeenCalledWith('1');
      expect(pollService.deletePoll).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith({ deleted: true });
    });

    it('should return 404 if poll to delete is not found', () => {
      mockRequest.params.id = '999';
      pollService.getPollById.mockReturnValue(null);

      pollController.delete(mockRequest, mockResponse);

      expect(pollService.getPollById).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Poll not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      const error = new Error('Database error');
      pollService.getPollById.mockImplementation(() => {
        throw error;
      });

      pollController.delete(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getResults', () => {
    it('should return poll results with 200 status', () => {
      mockRequest.params.id = '1';

      const mockResults = {
        poll: {
          id: 1,
          title: 'Poll 1',
          description: 'Description 1',
          is_active: 1,
        },
        options: [
          { id: 1, text: 'Option 1', votes: 7, percentage: 70 },
          { id: 2, text: 'Option 2', votes: 3, percentage: 30 },
        ],
        totalVotes: 10,
      };

      pollService.getPollResults.mockReturnValue(mockResults);

      pollController.getResults(mockRequest, mockResponse);

      expect(pollService.getPollResults).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockResults);
    });

    it('should return 404 if poll is not found', () => {
      mockRequest.params.id = '999';
      pollService.getPollResults.mockReturnValue(null);

      pollController.getResults(mockRequest, mockResponse);

      expect(pollService.getPollResults).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Poll not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      const error = new Error('Database error');
      pollService.getPollResults.mockImplementation(() => {
        throw error;
      });

      pollController.getResults(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });
});
