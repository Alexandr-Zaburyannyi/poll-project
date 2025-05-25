/** @format */
const pollService = require('../services/pollService');

class PollController {
  create(req, res) {
    const { title, description, is_active } = req.body;
    try {
      const result = pollService.createPoll(title, description, is_active ?? 1);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  getAll(req, res) {
    try {
      const polls = pollService.getAllPolls();
      res.json(polls);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  getById(req, res) {
    try {
      const poll = pollService.getPollById(req.params.id);
      if (!poll) return res.status(404).json({ error: 'Poll not found' });
      res.json(poll);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  update(req, res) {
    const { title, description, is_active } = req.body;
    try {
      const result = pollService.updatePoll(
        req.params.id,
        title,
        description,
        is_active
      );
      if (!result.updated)
        return res.status(404).json({ error: 'Poll not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  delete(req, res) {
    try {
      const result = pollService.deletePoll(req.params.id);
      if (!result.deleted)
        return res.status(404).json({ error: 'Poll not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  getResults(req, res) {
    try {
      const pollId = req.params.id;
      const results = pollService.getPollResults(pollId);

      if (!results) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new PollController();
