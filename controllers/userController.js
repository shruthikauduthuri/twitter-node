const database = require('../config/database');

class UserController {
  async getFollowing(req, res) {
    try {
      const { username } = req;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get following list
      const following = await db.all(`
        SELECT u.name FROM user u
        INNER JOIN follower f ON u.user_id = f.following_user_id
        WHERE f.follower_user_id = ?
        ORDER BY u.name
      `, [user.user_id]);

      res.json(following);
    } catch (error) {
      console.error('Following fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getFollowers(req, res) {
    try {
      const { username } = req;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get followers list
      const followers = await db.all(`
        SELECT u.name FROM user u
        INNER JOIN follower f ON u.user_id = f.follower_user_id
        WHERE f.following_user_id = ?
        ORDER BY u.name
      `, [user.user_id]);

      res.json(followers);
    } catch (error) {
      console.error('Followers fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new UserController();