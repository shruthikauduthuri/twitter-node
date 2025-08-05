import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import TweetCompose from '../components/Tweet/TweetCompose';
import TweetCard from '../components/Tweet/TweetCard';
import { tweetAPI } from '../services/api';

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);

  const fetchTweets = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setIsRefreshing(true);
      const data = await tweetAPI.getFeed();
      setTweets(data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    } finally {
      setIsLoading(false);
      if (showRefreshLoader) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleTweetCreated = () => {
    fetchTweets(true);
  };

  const handleRefresh = () => {
    fetchTweets(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-twitter-dark/80 backdrop-blur-md border-b border-twitter-extraLightGray dark:border-twitter-darker z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Home</h1>
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-ghost"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Tweet Compose */}
      <TweetCompose onTweetCreated={handleTweetCreated} />

      {/* Tweets Feed */}
      <div className="divide-y divide-twitter-extraLightGray dark:divide-twitter-darker">
        <AnimatePresence>
          {tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <TweetCard
                key={`${tweet.username}-${tweet.dateTime}-${index}`}
                tweet={tweet}
              />
            ))
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-twitter-gray text-lg mb-4">No tweets in your feed yet</p>
              <p className="text-twitter-gray">Follow some users to see their tweets here!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Compose Button (Mobile) */}
      <motion.button
        onClick={() => setShowComposeModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-twitter-blue hover:bg-twitter-darkBlue text-white rounded-full shadow-lg flex items-center justify-center lg:hidden z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Compose Modal */}
      <AnimatePresence>
        {showComposeModal && (
          <TweetCompose
            isModal={true}
            onClose={() => setShowComposeModal(false)}
            onTweetCreated={() => {
              handleTweetCreated();
              setShowComposeModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;