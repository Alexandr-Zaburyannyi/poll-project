/** @format */
const optionService = require('../services/optionService');
const pollService = require('../services/pollService');

class OptionController {
  create(req, res) {
    const { poll_id, text } = req.body;
    try {
      const poll = pollService.getPollById(poll_id);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      if (poll.created_by && poll.created_by !== req.user.id) {
        return res
          .status(403)
          .json({ error: 'Unauthorized to add options to this poll' });
      }

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
      const option = optionService.getOptionById(req.params.id);
      if (!option) {
        return res.status(404).json({ error: 'Option not found' });
      }

      const poll = pollService.getPollById(option.poll_id);
      if (poll && poll.created_by && poll.created_by !== req.user.id) {
        return res
          .status(403)
          .json({ error: 'Unauthorized to update this option' });
      }

      const result = optionService.updateOption(req.params.id, poll_id, text);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  delete(req, res) {
    try {
      const option = optionService.getOptionById(req.params.id);
      if (!option) {
        return res.status(404).json({ error: 'Option not found' });
      }

      const poll = pollService.getPollById(option.poll_id);
      if (poll && poll.created_by && poll.created_by !== req.user.id) {
        return res
          .status(403)
          .json({ error: 'Unauthorized to delete this option' });
      }

      const result = optionService.deleteOption(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new OptionController();
