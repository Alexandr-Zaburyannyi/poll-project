/** @format */
const voteController = require('../../src/controllers/voteController');
const voteService = require('../../src/services/voteService');

jest.mock('../../src/services/voteService');

describe('VoteController', () => {
  let mockRequest;
  let mockResponse;
  let responseObject;

  beforeEach(() => {
    responseObject = {};

    mockRequest = {
      body: {},
      params: {},
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
    it('should create a vote and return 201 status', () => {
      mockRequest.body = { option_id: 1, voter_id: 'user123' };
      voteService.createVote.mockReturnValue({ id: 1 });

      voteController.create(mockRequest, mockResponse);

      expect(voteService.createVote).toHaveBeenCalledWith(1, 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.body = { option_id: 1, voter_id: 'user123' };
      const error = new Error('Database error');
      voteService.createVote.mockImplementation(() => {
        throw error;
      });

      voteController.create(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getAll', () => {
    it('should return all votes with 200 status', () => {
      const mockVotes = [
        { id: 1, option_id: 1, voter_id: 'user1' },
        { id: 2, option_id: 2, voter_id: 'user2' },
      ];
      voteService.getAllVotes.mockReturnValue(mockVotes);

      voteController.getAll(mockRequest, mockResponse);

      expect(voteService.getAllVotes).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockVotes);
    });

    it('should handle errors and return 500 status', () => {
      const error = new Error('Database error');
      voteService.getAllVotes.mockImplementation(() => {
        throw error;
      });

      voteController.getAll(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getById', () => {
    it('should return a vote by id with 200 status', () => {
      mockRequest.params.id = '1';
      const mockVote = { id: 1, option_id: 1, voter_id: 'user1' };
      voteService.getVoteById.mockReturnValue(mockVote);

      voteController.getById(mockRequest, mockResponse);

      expect(voteService.getVoteById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockVote);
    });

    it('should return 404 if vote is not found', () => {
      mockRequest.params.id = '999';
      voteService.getVoteById.mockReturnValue(null);

      voteController.getById(mockRequest, mockResponse);

      expect(voteService.getVoteById).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Vote not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      const error = new Error('Database error');
      voteService.getVoteById.mockImplementation(() => {
        throw error;
      });

      voteController.getById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('update', () => {
    it('should update a vote and return success status', () => {
      mockRequest.params.id = '1';
      mockRequest.body = { option_id: 2, voter_id: 'user123' };
      voteService.updateVote.mockReturnValue({ updated: true });

      voteController.update(mockRequest, mockResponse);

      expect(voteService.updateVote).toHaveBeenCalledWith('1', 2, 'user123');
      expect(mockResponse.json).toHaveBeenCalledWith({ updated: true });
    });

    it('should return 404 if vote to update is not found', () => {
      mockRequest.params.id = '999';
      mockRequest.body = { option_id: 2, voter_id: 'user123' };
      voteService.updateVote.mockReturnValue({ updated: false });

      voteController.update(mockRequest, mockResponse);

      expect(voteService.updateVote).toHaveBeenCalledWith('999', 2, 'user123');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Vote not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      mockRequest.body = { option_id: 2, voter_id: 'user123' };
      const error = new Error('Database error');
      voteService.updateVote.mockImplementation(() => {
        throw error;
      });

      voteController.update(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('delete', () => {
    it('should delete a vote and return success status', () => {
      mockRequest.params.id = '1';
      voteService.deleteVote.mockReturnValue({ deleted: true });

      voteController.delete(mockRequest, mockResponse);

      expect(voteService.deleteVote).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith({ deleted: true });
    });

    it('should return 404 if vote to delete is not found', () => {
      mockRequest.params.id = '999';
      voteService.deleteVote.mockReturnValue({ deleted: false });

      voteController.delete(mockRequest, mockResponse);

      expect(voteService.deleteVote).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Vote not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      const error = new Error('Database error');
      voteService.deleteVote.mockImplementation(() => {
        throw error;
      });

      voteController.delete(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });
});
