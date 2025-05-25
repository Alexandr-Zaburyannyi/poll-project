/** @format */
const db = require('../db/setup');

class PollService {
  createPoll(title, description, is_active = 1) {
    const stmt = db.prepare(
      'INSERT INTO polls (title, description, is_active) VALUES (?, ?, ?)'
    );
    const info = stmt.run(title, description, is_active);
    return { id: info.lastInsertRowid };
  }

  getAllPolls() {
    return db.prepare('SELECT * FROM polls').all();
  }

  getPollById(id) {
    return db.prepare('SELECT * FROM polls WHERE id = ?').get(id);
  }

  updatePoll(id, title, description, is_active) {
    const stmt = db.prepare(
      'UPDATE polls SET title = ?, description = ?, is_active = ? WHERE id = ?'
    );
    const info = stmt.run(title, description, is_active, id);
    return { updated: info.changes > 0 };
  }

  deletePoll(id) {
    const stmt = db.prepare('DELETE FROM polls WHERE id = ?');
    const info = stmt.run(id);
    return { deleted: info.changes > 0 };
  }

  getPollResults(pollId) {
    const poll = this.getPollById(pollId);
    if (!poll) return null;

    const options = db
      .prepare('SELECT id, text FROM options WHERE poll_id = ?')
      .all(pollId);

    if (options.length === 0) {
      return { poll, options: [] };
    }

    const totalVotesQuery = db.prepare(`
      SELECT COUNT(*) as total 
      FROM votes v
      JOIN options o ON v.option_id = o.id
      WHERE o.poll_id = ?
    `);

    const { total } = totalVotesQuery.get(pollId) || { total: 0 };

    if (total === 0) {
      return {
        poll,
        options: options.map((option) => ({
          ...option,
          votes: 0,
          percentage: 0,
        })),
        totalVotes: 0,
      };
    }

    const optionsWithVotes = options.map((option) => {
      const votesQuery = db.prepare(`
        SELECT COUNT(*) as count 
        FROM votes 
        WHERE option_id = ?
      `);

      const { count } = votesQuery.get(option.id) || { count: 0 };
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

      return {
        ...option,
        votes: count,
        percentage,
      };
    });

    return {
      poll,
      options: optionsWithVotes,
      totalVotes: total,
    };
  }
}

module.exports = new PollService();
