/** @format */
const optionController = require('../../src/controllers/optionController');
const optionService = require('../../src/services/optionService');

jest.mock('../../src/services/optionService');

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
      optionService.createOption.mockReturnValue({ id: 1 });

      optionController.create(mockRequest, mockResponse);

      expect(optionService.createOption).toHaveBeenCalledWith(1, 'Option Text');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.body = { poll_id: 1, text: 'Option Text' };
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
      optionService.updateOption.mockReturnValue({ updated: true });

      optionController.update(mockRequest, mockResponse);

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
      optionService.updateOption.mockReturnValue({ updated: false });

      optionController.update(mockRequest, mockResponse);

      expect(optionService.updateOption).toHaveBeenCalledWith(
        '999',
        1,
        'Updated Option'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Option not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      mockRequest.body = { poll_id: 1, text: 'Updated Option' };
      const error = new Error('Database error');
      optionService.updateOption.mockImplementation(() => {
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
      optionService.deleteOption.mockReturnValue({ deleted: true });

      optionController.delete(mockRequest, mockResponse);

      expect(optionService.deleteOption).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith({ deleted: true });
    });

    it('should return 404 if option to delete is not found', () => {
      mockRequest.params.id = '999';
      optionService.deleteOption.mockReturnValue({ deleted: false });

      optionController.delete(mockRequest, mockResponse);

      expect(optionService.deleteOption).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Option not found',
      });
    });

    it('should handle errors and return 500 status', () => {
      mockRequest.params.id = '1';
      const error = new Error('Database error');
      optionService.deleteOption.mockImplementation(() => {
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
