const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/user/following', authenticateToken, userController.getFollowing);
router.get('/user/followers', authenticateToken, userController.getFollowers);

module.exports = router;