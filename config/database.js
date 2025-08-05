const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  async initialize() {
    try {
      const dbPath = path.join(__dirname, '..', process.env.DB_PATH || 'twitterClone.db');
      this.db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      console.log('Database connected successfully');
      return this.db;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

module.exports = new Database();