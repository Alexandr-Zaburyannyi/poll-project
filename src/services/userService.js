/** @format */
const db = require('../db/setup');

class UserService {
  /**
   * Create or update a user in the database
   * @param {Object} user - User data from Google OAuth
   * @returns {Object} - Created or updated user
   */
  saveUser(user) {
    try {
      const stmt = db.prepare(`
        INSERT INTO users (id, email, name, picture)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          email = excluded.email,
          name = excluded.name,
          picture = excluded.picture
      `);

      stmt.run(user.id, user.email, user.name, user.picture);

      return this.getUserById(user.id);
    } catch (err) {
      throw new Error(`Error saving user: ${err.message}`);
    }
  }

  /**
   * Get a user by ID
   * @param {string} id - Google user ID
   * @returns {Object|null} - User object or null if not found
   */
  getUserById(id) {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      return stmt.get(id) || null;
    } catch (err) {
      throw new Error(`Error fetching user: ${err.message}`);
    }
  }
}

module.exports = new UserService();
