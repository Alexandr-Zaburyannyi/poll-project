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
}

module.exports = new PollService();
