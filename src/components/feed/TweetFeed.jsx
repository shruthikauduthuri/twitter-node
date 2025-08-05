import React from 'react';
import TweetCard from '../tweet/TweetCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const TweetFeed = ({ tweets, loading, error, onDeleteTweet }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-twitter-darkGray text-lg">{error}</p>
      </div>
    );
  }

  if (!tweets || tweets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-twitter-darkGray text-lg">No tweets to show</p>
        <p className="text-twitter-darkGray text-sm mt-2">
          Follow some users or create your first tweet!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-twitter-extraLightGray">
      {tweets.map((tweet, index) => (
        <TweetCard
          key={`${tweet.username}-${tweet.dateTime}-${index}`}
          tweet={tweet}
          onDelete={() => onDeleteTweet && onDeleteTweet(tweet.tweet_id)}
        />
      ))}
    </div>
  );
};

export default TweetFeed;