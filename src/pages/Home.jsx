import React from 'react';
import TweetComposer from '../components/tweet/TweetComposer';
import TweetFeed from '../components/feed/TweetFeed';
import { useTweets } from '../hooks/useTweets';

const Home = () => {
  const { tweets, loading, error, createTweet, deleteTweet } = useTweets();

  const handleCreateTweet = async (tweetText) => {
    const result = await createTweet(tweetText);
    if (!result.success) {
      // Handle error (could show toast notification)
      console.error('Failed to create tweet:', result.error);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    const result = await deleteTweet(tweetId);
    if (!result.success) {
      // Handle error (could show toast notification)
      console.error('Failed to delete tweet:', result.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto border-x border-twitter-extraLightGray min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-twitter-extraLightGray z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-twitter-black">Home</h1>
        </div>
      </div>

      {/* Tweet Composer */}
      <TweetComposer onTweet={handleCreateTweet} />

      {/* Tweet Feed */}
      <TweetFeed
        tweets={tweets}
        loading={loading}
        error={error}
        onDeleteTweet={handleDeleteTweet}
      />
    </div>
  );
};

export default Home;