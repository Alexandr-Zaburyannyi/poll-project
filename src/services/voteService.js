/** @format */
const db = require('../db/setup');

class VoteService {
  createVote(option_id, voter_id) {
    const stmt = db.prepare(
      'INSERT INTO votes (option_id, voter_id) VALUES (?, ?)'
    );
    const info = stmt.run(option_id, voter_id);
    return { id: info.lastInsertRowid };
  }

  getAllVotes() {
    return db.prepare('SELECT * FROM votes').all();
  }

  getVoteById(id) {
    return db.prepare('SELECT * FROM votes WHERE id = ?').get(id);
  }

  updateVote(id, option_id, voter_id) {
    const stmt = db.prepare(
      'UPDATE votes SET option_id = ?, voter_id = ? WHERE id = ?'
    );
    const info = stmt.run(option_id, voter_id, id);
    return { updated: info.changes > 0 };
  }

  deleteVote(id) {
    const stmt = db.prepare('DELETE FROM votes WHERE id = ?');
    const info = stmt.run(id);
    return { deleted: info.changes > 0 };
  }
}

module.exports = new VoteService();
