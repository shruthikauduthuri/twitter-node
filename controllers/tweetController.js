const database = require('../config/database');

class TweetController {
  async getFeed(req, res) {
    try {
      const { username } = req;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get tweets from followed users
      const tweets = await db.all(`
        SELECT u.username, t.tweet, t.date_time AS dateTime 
        FROM tweet t
        INNER JOIN user u ON t.user_id = u.user_id 
        WHERE t.user_id IN (
          SELECT following_user_id FROM follower WHERE follower_user_id = ?
        ) 
        ORDER BY t.date_time DESC 
        LIMIT 20
      `, [user.user_id]);

      res.json(tweets);
    } catch (error) {
      console.error('Feed fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserTweets(req, res) {
    try {
      const { username } = req;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get user's tweets with counts
      const tweets = await db.all(`
        SELECT 
          t.tweet,
          (SELECT COUNT(*) FROM like l WHERE l.tweet_id = t.tweet_id) AS likes,
          (SELECT COUNT(*) FROM reply r WHERE r.tweet_id = t.tweet_id) AS replies,
          t.date_time AS dateTime
        FROM tweet t
        WHERE t.user_id = ?
        ORDER BY t.date_time DESC
      `, [user.user_id]);

      res.json(tweets);
    } catch (error) {
      console.error('User tweets fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTweet(req, res) {
    try {
      const { username } = req;
      const { tweet } = req.body;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create tweet
      await db.run(
        'INSERT INTO tweet (tweet, user_id, date_time) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [tweet.trim(), user.user_id]
      );

      res.status(201).json({ message: 'Tweet created successfully' });
    } catch (error) {
      console.error('Tweet creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTweet(req, res) {
    try {
      const { username } = req;
      const { tweetId } = req.params;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if tweet exists and belongs to user
      const tweet = await db.get(
        'SELECT user_id FROM tweet WHERE tweet_id = ?',
        [tweetId]
      );

      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found' });
      }

      if (tweet.user_id !== user.user_id) {
        return res.status(403).json({ error: 'Unauthorized to delete this tweet' });
      }

      // Delete tweet
      await db.run('DELETE FROM tweet WHERE tweet_id = ?', [tweetId]);

      res.json({ message: 'Tweet deleted successfully' });
    } catch (error) {
      console.error('Tweet deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTweetDetails(req, res) {
    try {
      const { username } = req;
      const { tweetId } = req.params;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user follows the tweet author
      const isFollowing = await db.get(`
        SELECT COUNT(*) AS count FROM follower f
        INNER JOIN tweet t ON f.following_user_id = t.user_id  
        WHERE f.follower_user_id = ? AND t.tweet_id = ?
      `, [user.user_id, tweetId]);

      if (isFollowing.count === 0) {
        return res.status(401).json({ error: 'Invalid Request' });
      }

      // Get tweet details
      const tweet = await db.get(`
        SELECT 
          t.tweet,
          (SELECT COUNT(*) FROM like l WHERE l.tweet_id = t.tweet_id) AS likes,
          (SELECT COUNT(*) FROM reply r WHERE r.tweet_id = t.tweet_id) AS replies,
          t.date_time AS dateTime
        FROM tweet t
        WHERE t.tweet_id = ?
      `, [tweetId]);

      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found' });
      }

      res.json(tweet);
    } catch (error) {
      console.error('Tweet details fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTweetLikes(req, res) {
    try {
      const { username } = req;
      const { tweetId } = req.params;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user follows the tweet author
      const isFollowing = await db.get(`
        SELECT COUNT(*) AS count FROM follower f
        INNER JOIN tweet t ON f.following_user_id = t.user_id  
        WHERE f.follower_user_id = ? AND t.tweet_id = ?
      `, [user.user_id, tweetId]);

      if (isFollowing.count === 0) {
        return res.status(401).json({ error: 'Invalid Request' });
      }

      // Get likes
      const likes = await db.all(`
        SELECT u.username FROM user u
        INNER JOIN like l ON u.user_id = l.user_id
        WHERE l.tweet_id = ?
      `, [tweetId]);

      res.json({ likes: likes.map(like => like.username) });
    } catch (error) {
      console.error('Tweet likes fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTweetReplies(req, res) {
    try {
      const { username } = req;
      const { tweetId } = req.params;
      const db = database.getDb();

      // Get user ID
      const user = await db.get('SELECT user_id FROM user WHERE username = ?', [username]);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user follows the tweet author
      const isFollowing = await db.get(`
        SELECT COUNT(*) AS count FROM follower f
        INNER JOIN tweet t ON f.following_user_id = t.user_id  
        WHERE f.follower_user_id = ? AND t.tweet_id = ?
      `, [user.user_id, tweetId]);

      if (isFollowing.count === 0) {
        return res.status(401).json({ error: 'Invalid Request' });
      }

      // Get replies
      const replies = await db.all(`
        SELECT u.name, r.reply FROM user u
        INNER JOIN reply r ON u.user_id = r.user_id
        WHERE r.tweet_id = ?
        ORDER BY r.date_time ASC
      `, [tweetId]);

      res.json({ replies });
    } catch (error) {
      console.error('Tweet replies fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new TweetController();