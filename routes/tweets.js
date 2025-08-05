const express = require('express');
const tweetController = require('../controllers/tweetController');
const { validateTweet } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Tweet routes
router.get('/user/tweets/feed', authenticateToken, tweetController.getFeed);
router.get('/user/tweets', authenticateToken, tweetController.getUserTweets);
router.post('/user/tweets', authenticateToken, validateTweet, tweetController.createTweet);
router.get('/tweets/:tweetId', authenticateToken, tweetController.getTweetDetails);
router.get('/tweets/:tweetId/likes', authenticateToken, tweetController.getTweetLikes);
router.get('/tweets/:tweetId/replies', authenticateToken, tweetController.getTweetReplies);
router.delete('/tweets/:tweetId', authenticateToken, tweetController.deleteTweet);

module.exports = router;