/** @format */
const optionService = require('../services/optionService');

class OptionController {
  create(req, res) {
    const { poll_id, text } = req.body;
    try {
      const result = optionService.createOption(poll_id, text);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  getAll(req, res) {
    try {
      const options = optionService.getAllOptions();
      res.json(options);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  getById(req, res) {
    try {
      const option = optionService.getOptionById(req.params.id);
      if (!option) return res.status(404).json({ error: 'Option not found' });
      res.json(option);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  update(req, res) {
    const { poll_id, text } = req.body;
    try {
      const result = optionService.updateOption(req.params.id, poll_id, text);
      if (!result.updated)
        return res.status(404).json({ error: 'Option not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  delete(req, res) {
    try {
      const result = optionService.deleteOption(req.params.id);
      if (!result.deleted)
        return res.status(404).json({ error: 'Option not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new OptionController();
