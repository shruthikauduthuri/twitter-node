# Twitter Clone API

This project is a Twitter clone API built using Node.js, Express, and SQLite. It provides various endpoints to perform operations on users, tweets, followers, likes, and replies.

## Table of Contents

- [Installation](#installation)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Register](#register)
  - [Login](#login)
  - [Profile](#profile)
  - [Tweets Feed](#tweets-feed)
  - [Following](#following)
  - [Followers](#followers)
  - [Tweet Details](#tweet-details)
  - [Tweet Likes](#tweet-likes)
  - [Tweet Replies](#tweet-replies)
  - [User Tweets](#user-tweets)
  - [Create Tweet](#create-tweet)
  - [Delete Tweet](#delete-tweet)
- [Authentication](#authentication)
- [License](#license)

## Installation

1. Clone the repository:
   `sh
 git clone https://github.com/your-username/twitter-clone-api.git
 cd twitter-clone-api
 `

2. Install the dependencies:
   `sh
 npm install
 `

3. Start the server:
   `sh
 npm start
 `

## Database Schema

The database consists of the following tables:

### User Table

| Column   | Type    |
| -------- | ------- |
| user_id  | INTEGER |
| name     | TEXT    |
| username | TEXT    |
| password | TEXT    |
| gender   | TEXT    |

### Follower Table

| Column            | Type    |
| ----------------- | ------- |
| follower_id       | INTEGER |
| follower_user_id  | INTEGER |
| following_user_id | INTEGER |

### Tweet Table

| Column    | Type     |
| --------- | -------- |
| tweet_id  | INTEGER  |
| tweet     | TEXT     |
| user_id   | INTEGER  |
| date_time | DATETIME |

### Reply Table

| Column    | Type     |
| --------- | -------- |
| reply_id  | INTEGER  |
| tweet_id  | INTEGER  |
| reply     | TEXT     |
| user_id   | INTEGER  |
| date_time | DATETIME |

### Like Table

| Column    | Type     |
| --------- | -------- |
| like_id   | INTEGER  |
| tweet_id  | INTEGER  |
| user_id   | INTEGER  |
| date_time | DATETIME |

## API Endpoints

### Register

- **Path:** `/register/`
- **Method:** `POST`
- **Request:**
  `json
    {
        "username": "JoeBiden",
        "password": "biden@123",
        "name": "Joe Biden",
        "gender": "male"
    }
    `
- **Responses:**
  - User already exists:
    - **Status code:** `400`
    - **Body:** `User already exists`
  - Password is too short:
    - **Status code:** `400`
    - **Body:** `Password is too short`
  - User created successfully:
    - **Status code:** `200`
    - **Body:** `User created successfully`

### Login

- **Path:** `/login/`
- **Method:** `POST`
- **Request:**
  `json
    {
        "username": "JoeBiden",
        "password": "biden@123"
    }
    `
- **Responses:**
  - Invalid user:
    - **Status code:** `400`
    - **Body:** `Invalid user`
  - Invalid password:
    - **Status code:** `400`
    - **Body:** `Invalid password`
  - Successful login:
    - **Status code:** `200`
    - **Body:** `{ "jwtToken": "your_jwt_token" }`

### Profile

- **Path:** `/profile/`
- **Method:** `GET`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Response:**
  `json
    {
        "user_id": 1,
        "name": "Joe Biden",
        "username": "JoeBiden",
        "password": "hashed_password",
        "gender": "male"
    }
    `

### Tweets Feed

- **Path:** `/user/tweets/feed/`
- **Method:** `GET`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Response:**
  `json
    [
        {
            "username": "SrBachchan",
            "tweet": "T 3859 - do something wonderful, people may imitate it ..",
            "dateTime": "2021-04-07 14:50:19"
        },
        ...
    ]
    `

### Following

- **Path:** `/user/following/`
- **Method:** `GET`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Response:**
  `json
    [
        {
            "name": "Narendra Modi"
        },
        ...
    ]
    `

### Followers

- **Path:** `/user/followers/`
- **Method:** `GET`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Response:**
  `json
    [
        {
            "name": "Narendra Modi"
        },
        ...
    ]
    `

### Tweet Details

- **Path:** `/tweets/:tweetId/`
- **Method:** `GET`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Responses:**
  - Invalid Request:
    - **Status code:** `401`
    - **Body:** `Invalid Request`
  - Tweet details:
    - **Status code:** `200`
    - **Body:**
      ```json
      {
        "tweet": "T 3859 - do something wonderful, people may imitate it ..",
        "likes": 3,
        "replies": 1,
        "dateTime": "2021-04-07 14:50:19"
      }
      ```

### Tweet Likes

- **Path:** `/tweets/:tweetId/likes/`
- **Method:** `GET`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Responses:**
  - Invalid Request:
    - **Status code:** `401`
    - **Body:** `Invalid Request`
  - Likes:
    - **Status code:** `200`
    - **Body:**
      ```json
      {
          "likes": ["albert", ...]
      }
      ```

### Tweet Replies

- **Path:** `/tweets/:tweetId/replies/`
- **Method:** `GET`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Responses:**
  - Invalid Request:
    - **Status code:** `401`
    - **Body:** `Invalid Request`
  - Replies:
    - **Status code:** `200`
    - **Body:**
      ```json
      {
          "replies": [
              {
                  "name": "Narendra Modi",
                  "reply": "When you see it.."
              },
              ...
          ]
      }
      ```

### User Tweets

- **Path:** `/user/tweets/`
- **Method:** `GET`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Response:**
  `json
    [
        {
            "tweet": "Ready to don the Blue and Gold",
            "likes": 3,
            "replies": 4,
            "dateTime": "2021-4-3 08:32:44"
        },
        ...
    ]
    `

### Create Tweet

- **Path:** `/user/tweets/`
- **Method:** `POST`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Request:**
  `json
    {
        "tweet": "The Mornings..."
    }
    `
- **Response:**
  - **Status code:** `200`
  - **Body:** `Created a Tweet`

### Delete Tweet

- **Path:** `/tweets/:tweetId/`
- **Method:** `DELETE`
- **Headers:**
  `http
    Authorization: Bearer <jwt_token>
    `
- **Responses:**
  - Invalid Request:
    - **Status code:** `401`
    - **Body:** `Invalid Request`
  - Tweet Removed:
    - **Status code:** `200`
    - **Body:** `Tweet Removed`

## Authentication

All endpoints (except `/register/` and `/login/`) require a valid JWT token in the Authorization header. The token should be in the format `Bearer <jwt_token>`.

- Invalid JWT Token:
  - **Status code:** `401`
  - **Body:** `Invalid JWT Token`

## License

This project is licensed under the MIT License. See the LICENSE file for details.
