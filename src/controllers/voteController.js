/** @format */
const voteService = require('../services/voteService');

class VoteController {
  create(req, res) {
    const { option_id } = req.body;
    const voter_id = req.user.id;

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
    const { option_id } = req.body;
    const voter_id = req.user.id;

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
      const vote = voteService.getVoteById(req.params.id);
      if (!vote) {
        return res.status(404).json({ error: 'Vote not found' });
      }

      if (vote.voter_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: 'Unauthorized to delete this vote' });
      }

      const result = voteService.deleteVote(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new VoteController();
