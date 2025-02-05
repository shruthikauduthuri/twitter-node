const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()

app.use(express.json())

let db = null

const dbPath = path.join(__dirname, 'twitterClone.db')

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log(`Server running at port 3000`)
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
  }
}

initializeDBAndServer()

app.post('/register/', async (request, response) => {
  const {username, password, name, gender} = request.body
  const hashedPassword = await bcrypt.hash(request.body.password, 10)
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    if (password.length < 6) {
      response.status(400)
      response.send('Password is too short')
    } else {
      const createUserQuery = `INSERT INTO user (username, name, password, name, gender) 
            VALUES ('${username}', '${name}', '${hashedPassword}', '${name}', '${gender}')`
      const dbResponse = await db.run(createUserQuery)
      response.send('User created successfully')
    }
  } else {
    response.status(400)
    response.send('User already exists')
  }
})

app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const dbUser = await db.get(selectUserQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      }
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})

const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (authHeader === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        request.username = payload.username
        next()
      }
    })
  }
}

app.get('/profile/', authenticateToken, async (request, response) => {
  const {username} = request
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`
  const userDetails = await db.get(selectUserQuery)
  response.send(userDetails)
})

app.get('/user/tweets/feed/', authenticateToken, async (request, response) => {
  const {username} = request
  const getUserId = `SELECT * FROM user WHERE username = '${username}'`
  const user = await db.get(getUserId)
  const userId = user.user_id
  const getTweets = `SELECT user.username, tweet.tweet, tweet.date_time AS dateTime FROM 
  tweet INNER JOIN user ON tweet.user_id = user.user_id 
  WHERE tweet.user_id IN (SELECT following_user_id FROM follower WHERE 
  follower_user_id = ${userId}) ORDER BY tweet.date_time DESC LIMIT 4;`

  const tweets = await db.all(getTweets)
  response.send(tweets)
})

app.get('/user/following/', authenticateToken, async (request, response) => {
  const {username} = request
  const getUserId = `SELECT * FROM user WHERE username = '${username}'`
  const user = await db.get(getUserId)
  const userId = user.user_id
  const getFollowingNames = `SELECT user.name FROM user INNER JOIN follower 
  ON user.user_id = follower.following_user_id WHERE follower_user_id = ${userId}`

  const followingNames = await db.all(getFollowingNames)
  response.send(followingNames)
})

app.get('/user/followers/', authenticateToken, async (request, response) => {
  const {username} = request
  const getUserId = `SELECT * from user WHERE username = '${username}'`
  const user = await db.get(getUserId)
  const userId = user.user_id
  const getFollowersNames = `SELECT user.name FROM user INNER JOIN follower 
  ON user.user_id = follower.follower_user_id WHERE following_user_id = ${userId}`

  const followerNames = await db.all(getFollowersNames)
  response.send(followerNames)
})

app.get('/tweets/:tweetsId/', authenticateToken, async (request, response) => {
  const {username} = request
  const {tweetsId} = request.params
  const getUserId = `SELECT * FROM user WHERE username = '${username}'`
  const user = await db.get(getUserId)
  const userId = user.user_id
  const getFollowingNames = `SELECT COUNT(*) AS isFollowing FROM follower INNER JOIN tweet 
  ON follower.following_user_id = tweet.user_id  
  WHERE follower.follower_user_id = ${userId} AND tweet.tweet_id = ${tweetsId}`
  const followingNames = await db.get(getFollowingNames)
  const count = followingNames.isFollowing

  if (count === 0) {
    response.status(401)
    response.send('Invalid Request')
    return
  } else {
    const getTweetDetails = `SELECT tweet.tweet, 
    (SELECT COUNT(*) FROM like WHERE like.tweet_id = tweet.tweet_id) AS likes,
    (SELECT COUNT(*) FROM reply WHERE reply.tweet_id = tweet.tweet_id) AS replies,
    tweet.date_time AS dateTime FROM tweet WHERE tweet.tweet_id = ${tweetsId}`

    const tweet = await db.get(getTweetDetails)
    response.send(tweet)
  }
})

app.get(
  '/tweets/:tweetId/likes/',
  authenticateToken,
  async (request, response) => {
    const {username} = request
    const {tweetId} = request.params
    const getUserId = `SELECT * FROM user WHERE username = '${username}'`
    const user = await db.get(getUserId)
    const userId = user.user_id
    const getFollowingNames = `SELECT COUNT(*) AS isFollowing FROM follower INNER JOIN tweet 
  ON follower.following_user_id = tweet.user_id  
  WHERE follower.follower_user_id = ${userId} AND tweet.tweet_id = ${tweetId}`
    const followingNames = await db.get(getFollowingNames)
    const count = followingNames.isFollowing

    if (count === 0) {
      response.status(401)
      response.send('Invalid Request')
      return
    } else {
      const getNames = `SELECT user.username FROM user INNER JOIN like 
      ON user.user_id = like.user_id WHERE like.tweet_id = ${tweetId}`

      const names = await db.all(getNames)
      const likeNames = names.map(user => user.username)
      response.send({likes: likeNames})
    }
  },
)

app.get(
  '/tweets/:tweetId/replies/',
  authenticateToken,
  async (request, response) => {
    const {username} = request
    const {tweetId} = request.params
    const getUserId = `SELECT * FROM user WHERE username = '${username}'`
    const user = await db.get(getUserId)
    const userId = user.user_id
    const getFollowingNames = `SELECT COUNT(*) AS isFollowing FROM follower INNER JOIN tweet 
  ON follower.following_user_id = tweet.user_id  
  WHERE follower.follower_user_id = ${userId} AND tweet.tweet_id = ${tweetId}`
    const followingNames = await db.get(getFollowingNames)
    const count = followingNames.isFollowing

    if (count === 0) {
      response.status(401)
      response.send('Invalid Request')
      return
    } else {
      const getNames = `SELECT user.name, reply.reply FROM user INNER JOIN reply 
      ON user.user_id = reply.user_id WHERE reply.tweet_id = ${tweetId}`

      const replies = await db.all(getNames)

      response.send({replies})
    }
  },
)

app.get('/user/tweets/', authenticateToken, async (request, response) => {
  const {username} = request
  const getUserId = `SELECT * FROM user WHERE username = '${username}'`
  const user = await db.get(getUserId)
  const userId = user.user_id

  const tweetsQuery = `SELECT tweet.tweet,
  (SELECT COUNT(*) FROM like WHERE like.tweet_id = tweet.tweet_id) AS likes,
    (SELECT COUNT(*) FROM reply WHERE reply.tweet_id = tweet.tweet_id) AS replies,
    tweet.date_time AS dateTime FROM tweet WHERE tweet.user_id = ${userId}`

  const tweets = await db.all(tweetsQuery)
  response.send(tweets)
})

app.post('/user/tweets/', authenticateToken, async (request, response) => {
  const {username} = request
  const {tweet} = request.body

  const getUserId = `SELECT * FROM user WHERE username = '${username}'`
  const user = await db.get(getUserId)
  const userId = user.user_id

  const createTweet = `INSERT INTO tweet (tweet, user_id, date_time) 
  VALUES ('${tweet}', ${userId}, CURRENT_TIMESTAMP)`
  await db.run(createTweet)
  response.status(200)
  response.send('Created a Tweet')
})

app.delete(
  '/tweets/:tweetId/',
  authenticateToken,
  async (request, response) => {
    const {username} = request
    const {tweetId} = request.params

    const getUserId = `SELECT * FROM user WHERE username = '${username}'`
    const user = await db.get(getUserId)
    const userId = user.user_id

    const getTweetQuery = `SELECT user_id FROM tweet WHERE tweet_id = ${tweetId}`
    const tweet = await db.get(getTweetQuery)

    if (tweet.user_id !== userId) {
      response.status(401)
      response.send('Invalid Request')
      return
    }

    const deleteQuery = `DELETE FROM tweet WHERE tweet_id = ${tweetId}`
    const tweetAfterDelete = await db.run(deleteQuery)
    console.log(tweetAfterDelete)
    response.send('Tweet Removed')
  },
)

module.exports = app
