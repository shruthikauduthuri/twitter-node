import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Link as LinkIcon, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tweetAPI, userAPI } from '../services/api';
import TweetCard from '../components/Tweet/TweetCard';

const Profile = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tweets');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [tweetsData, followersData, followingData] = await Promise.all([
          tweetAPI.getUserTweets(),
          userAPI.getFollowers(),
          userAPI.getFollowing(),
        ]);
        
        setTweets(tweetsData);
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleDeleteTweet = (tweetId) => {
    setTweets(tweets.filter(tweet => tweet.tweet_id !== tweetId));
  };

  const tabs = [
    { id: 'tweets', label: 'Tweets', count: tweets.length },
    { id: 'replies', label: 'Replies', count: 0 },
    { id: 'media', label: 'Media', count: 0 },
    { id: 'likes', label: 'Likes', count: 0 },
  ];

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
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
          <p className="text-sm text-twitter-gray">{tweets.length} Tweets</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-twitter-blue to-twitter-darkBlue"></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 bg-twitter-blue rounded-full border-4 border-white dark:border-twitter-dark flex items-center justify-center">
              <span className="text-white font-bold text-4xl">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* Edit Profile Button */}
            <motion.button
              className="absolute top-0 right-0 btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit profile
            </motion.button>
          </div>

          {/* User Info */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {user?.name}
            </h2>
            <p className="text-twitter-gray mb-3">@{user?.username}</p>
            
            <p className="text-gray-900 dark:text-white mb-3">
              Building amazing things with React and Node.js 🚀
            </p>

            {/* Profile Details */}
            <div className="flex flex-wrap items-center gap-4 text-twitter-gray text-sm mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Earth</span>
              </div>
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                <a href="#" className="text-twitter-blue hover:underline">
                  portfolio.dev
                </a>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined March 2021</span>
              </div>
            </div>

            {/* Follow Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-gray-900 dark:text-white">
                  {following.length}
                </span>
                <span className="text-twitter-gray">Following</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-gray-900 dark:text-white">
                  {followers.length}
                </span>
                <span className="text-twitter-gray">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-twitter-extraLightGray dark:border-twitter-darker">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-4 text-center font-medium transition-colors duration-200 relative ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-white'
                  : 'text-twitter-gray hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-1 text-sm text-twitter-gray">({tab.count})</span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-twitter-blue rounded-full"
                  layoutId="activeTab"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="divide-y divide-twitter-extraLightGray dark:divide-twitter-darker">
        <AnimatePresence mode="wait">
          {activeTab === 'tweets' && (
            <motion.div
              key="tweets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {tweets.length > 0 ? (
                tweets.map((tweet, index) => (
                  <TweetCard
                    key={`${tweet.tweet}-${index}`}
                    tweet={{
                      ...tweet,
                      username: user?.username,
                      name: user?.name,
                      tweet_id: index + 1, // Temporary ID for deletion
                    }}
                    onDelete={handleDeleteTweet}
                  />
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-twitter-gray text-lg mb-4">No tweets yet</p>
                  <p className="text-twitter-gray">Start tweeting to see your posts here!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab !== 'tweets' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <p className="text-twitter-gray text-lg mb-4">Nothing to see here — yet</p>
              <p className="text-twitter-gray">
                {activeTab === 'replies' && 'When you reply to tweets, they\'ll show up here.'}
                {activeTab === 'media' && 'When you share photos or videos, they\'ll show up here.'}
                {activeTab === 'likes' && 'When you like tweets, they\'ll show up here.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;