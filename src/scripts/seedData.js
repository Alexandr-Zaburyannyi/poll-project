/** @format */

require('dotenv').config({ path: '../../.env' });
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    option_id INTEGER NOT NULL,
    voter_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (option_id) REFERENCES options (id) ON DELETE CASCADE
  );
`);

db.exec(`
  DELETE FROM votes;
  DELETE FROM options;
  DELETE FROM polls;
`);

const insertPoll = db.prepare(
  'INSERT INTO polls (title, description) VALUES (?, ?)'
);
const insertOption = db.prepare(
  'INSERT INTO options (poll_id, text) VALUES (?, ?)'
);
const insertVote = db.prepare(
  'INSERT INTO votes (option_id, voter_name) VALUES (?, ?)'
);

const seedData = db.transaction(() => {
  const poll1Id = insertPoll.run(
    'Favorite Programming Language',
    'Which programming language do you prefer to work with?'
  ).lastInsertRowid;
  const poll1Options = [
    insertOption.run(poll1Id, 'JavaScript').lastInsertRowid,
    insertOption.run(poll1Id, 'Python').lastInsertRowid,
    insertOption.run(poll1Id, 'Java').lastInsertRowid,
    insertOption.run(poll1Id, 'C#').lastInsertRowid,
  ];

  insertVote.run(poll1Options[0], 'Alice');
  insertVote.run(poll1Options[0], 'Bob');
  insertVote.run(poll1Options[1], 'Charlie');
  insertVote.run(poll1Options[2], 'Diana');
  insertVote.run(poll1Options[0], 'Eve');
  insertVote.run(poll1Options[1], 'Frank');

  const poll2Id = insertPoll.run(
    'Best Framework for Web Development',
    'What do you think is the best framework?'
  ).lastInsertRowid;
  const poll2Options = [
    insertOption.run(poll2Id, 'React').lastInsertRowid,
    insertOption.run(poll2Id, 'Vue').lastInsertRowid,
    insertOption.run(poll2Id, 'Angular').lastInsertRowid,
    insertOption.run(poll2Id, 'Svelte').lastInsertRowid,
  ];

  insertVote.run(poll2Options[0], 'Grace');
  insertVote.run(poll2Options[1], 'Henry');
  insertVote.run(poll2Options[0], 'Isabel');
  insertVote.run(poll2Options[3], 'Jack');

  const poll3Id = insertPoll.run(
    'Preferred Database',
    'Which database system do you prefer?'
  ).lastInsertRowid;
  const poll3Options = [
    insertOption.run(poll3Id, 'PostgreSQL').lastInsertRowid,
    insertOption.run(poll3Id, 'MySQL').lastInsertRowid,
    insertOption.run(poll3Id, 'MongoDB').lastInsertRowid,
    insertOption.run(poll3Id, 'SQLite').lastInsertRowid,
  ];

  insertVote.run(poll3Options[0], 'Kelly');
  insertVote.run(poll3Options[3], 'Liam');
  insertVote.run(poll3Options[2], 'Maria');
  insertVote.run(poll3Options[1], 'Nathan');
  insertVote.run(poll3Options[3], 'Olivia');
});

seedData();

console.log('Database seeded successfully!');

db.close();
