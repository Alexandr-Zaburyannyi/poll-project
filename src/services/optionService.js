/** @format */
const db = require('../db/setup');

class OptionService {
  createOption(poll_id, text) {
    const stmt = db.prepare(
      'INSERT INTO options (poll_id, text) VALUES (?, ?)'
    );
    const info = stmt.run(poll_id, text);
    return { id: info.lastInsertRowid };
  }

  getAllOptions() {
    return db.prepare('SELECT * FROM options').all();
  }

  getOptionById(id) {
    return db.prepare('SELECT * FROM options WHERE id = ?').get(id);
  }

  updateOption(id, poll_id, text) {
    const stmt = db.prepare(
      'UPDATE options SET poll_id = ?, text = ? WHERE id = ?'
    );
    const info = stmt.run(poll_id, text, id);
    return { updated: info.changes > 0 };
  }

  deleteOption(id) {
    const stmt = db.prepare('DELETE FROM options WHERE id = ?');
    const info = stmt.run(id);
    return { deleted: info.changes > 0 };
  }
}

module.exports = new OptionService();
