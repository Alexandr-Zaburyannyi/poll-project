/** @format */
const voteService = require('../services/voteService');

class VoteController {
  create(req, res) {
    const { option_id, voter_id } = req.body;
    try {
      const result = voteService.createVote(option_id, voter_id);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  getAll(req, res) {
    try {
      const votes = voteService.getAllVotes();
      res.json(votes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  getById(req, res) {
    try {
      const vote = voteService.getVoteById(req.params.id);
      if (!vote) return res.status(404).json({ error: 'Vote not found' });
      res.json(vote);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  update(req, res) {
    const { option_id, voter_id } = req.body;
    try {
      const result = voteService.updateVote(req.params.id, option_id, voter_id);
      if (!result.updated)
        return res.status(404).json({ error: 'Vote not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  delete(req, res) {
    try {
      const result = voteService.deleteVote(req.params.id);
      if (!result.deleted)
        return res.status(404).json({ error: 'Vote not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new VoteController();
