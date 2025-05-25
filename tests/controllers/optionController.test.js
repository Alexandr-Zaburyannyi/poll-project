/** @format */
const optionController = require('../../src/controllers/optionController');
const optionService = require('../../src/services/optionService');
const pollService = require('../../src/services/pollService');

jest.mock('../../src/services/optionService');
jest.mock('../../src/services/pollService');

describe('OptionController', () => {
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
    it('should create an option and return 201 status', () => {
      mockRequest.body = { poll_id: 1, text: 'Option Text' };
      mockRequest.user = { id: 'user123' };

      pollService.getPollById.mockReturnValue({ id: 1, created_by: 'user123' });
      optionService.createOption.mockReturnValue({ id: 1 });

      optionController.create(mockRequest, mockResponse);

      expect(pollService.getPollById).toHaveBeenCalledWith(1);
      expect(optionService.createOption).toHaveBeenCalledWith(1, 'Option Text');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.body = { poll_id: 1, text: 'Option Text' };
      mockRequest.user = { id: 'user123' };

      pollService.getPollById.mockReturnValue({ id: 1, created_by: 'user123' });
      const error = new Error('Database error');
      optionService.createOption.mockImplementation(() => {
        throw error;
      });

      optionController.create(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getAll', () => {
    it('should return all options with 200 status', () => {
      const mockOptions = [
        { id: 1, poll_id: 1, text: 'Option 1' },
        { id: 2, poll_id: 1, text: 'Option 2' },
      ];
      optionService.getAllOptions.mockReturnValue(mockOptions);

      optionController.getAll(mockRequest, mockResponse);

      expect(optionService.getAllOptions).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockOptions);
    });

    it('should handle errors and return 500 status', () => {
      const error = new Error('Database error');
      optionService.getAllOptions.mockImplementation(() => {
        throw error;
      });

      optionController.getAll(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('getById', () => {
    it('should return an option by id with 200 status', () => {
      mockRequest.params.id = '1';
      const mockOption = { id: 1, poll_id: 1, text: 'Option 1' };
      optionService.getOptionById.mockReturnValue(mockOption);

      optionController.getById(mockRequest, mockResponse);

      expect(optionService.getOptionById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockOption);
    });

    it('should return 404 if option is not found', () => {
      mockRequest.params.id = '999';
      optionService.getOptionById.mockReturnValue(null);

      optionController.getById(mockRequest, mockResponse);

      expect(optionService.getOptionById).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Option not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      const error = new Error('Database error');
      optionService.getOptionById.mockImplementation(() => {
        throw error;
      });

      optionController.getById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('update', () => {
    it('should update an option and return success status', () => {
      mockRequest.params.id = '1';
      mockRequest.body = { poll_id: 1, text: 'Updated Option' };
      mockRequest.user = { id: 'user123' };

      optionService.getOptionById.mockReturnValue({ id: 1, poll_id: 1 });
      const mockPoll = { id: 1, created_by: 'user123' };
      const pollService = require('../../src/services/pollService');
      jest.mock('../../src/services/pollService');
      pollService.getPollById = jest.fn().mockReturnValue(mockPoll);

      optionService.updateOption.mockReturnValue({ updated: true });

      optionController.update(mockRequest, mockResponse);

      expect(optionService.getOptionById).toHaveBeenCalledWith('1');
      expect(optionService.updateOption).toHaveBeenCalledWith(
        '1',
        1,
        'Updated Option'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({ updated: true });
    });

    it('should return 404 if option to update is not found', () => {
      mockRequest.params.id = '999';
      mockRequest.body = { poll_id: 1, text: 'Updated Option' };
      optionService.getOptionById.mockReturnValue(null);

      optionController.update(mockRequest, mockResponse);

      expect(optionService.getOptionById).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Option not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      mockRequest.body = { poll_id: 1, text: 'Updated Option' };
      const error = new Error('Database error');

      optionService.getOptionById.mockImplementation(() => {
        throw error;
      });

      optionController.update(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });

  describe('delete', () => {
    it('should delete an option and return success status', () => {
      mockRequest.params.id = '1';
      mockRequest.user = { id: 'user123' };

      optionService.getOptionById.mockReturnValue({ id: 1, poll_id: 1 });
      const mockPoll = { id: 1, created_by: 'user123' };
      const pollService = require('../../src/services/pollService');
      pollService.getPollById = jest.fn().mockReturnValue(mockPoll);

      optionService.deleteOption.mockReturnValue({ deleted: true });

      optionController.delete(mockRequest, mockResponse);

      expect(optionService.getOptionById).toHaveBeenCalledWith('1');
      expect(optionService.deleteOption).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith({ deleted: true });
    });

    it('should return 404 if option to delete is not found', () => {
      mockRequest.params.id = '999';
      optionService.getOptionById.mockReturnValue(null);

      optionController.delete(mockRequest, mockResponse);

      expect(optionService.getOptionById).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Option not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      mockRequest.user = { id: 'user123' };
      const error = new Error('Database error');

      optionService.getOptionById.mockImplementation(() => {
        throw error;
      });

      optionController.delete(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Database error',
      });
    });
  });
});
