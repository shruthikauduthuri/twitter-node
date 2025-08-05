import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp } from 'lucide-react';
import { userAPI } from '../../services/api';

const RightSidebar = () => {
  const [following, setFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const data = await userAPI.getFollowing();
        setFollowing(data.slice(0, 3)); // Show only first 3
      } catch (error) {
        console.error('Error fetching following:', error);
      }
    };

    fetchFollowing();
  }, []);

  const trends = [
    { topic: 'Technology', posts: '125K' },
    { topic: 'React', posts: '89K' },
    { topic: 'JavaScript', posts: '156K' },
    { topic: 'Web Development', posts: '78K' },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-twitter-dark p-4 overflow-y-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-twitter-gray" />
          <input
            type="text"
            placeholder="Search Twitter"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-twitter-light dark:bg-twitter-darker rounded-full border-none focus:outline-none focus:ring-2 focus:ring-twitter-blue text-gray-900 dark:text-white placeholder-twitter-gray"
          />
        </div>
      </div>

      {/* Trends */}
      <motion.div
        className="bg-twitter-light dark:bg-twitter-darker rounded-2xl p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          What's happening
        </h2>
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <motion.div
              key={trend.topic}
              className="hover:bg-white dark:hover:bg-twitter-dark p-2 rounded-lg cursor-pointer transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-twitter-gray">Trending in Technology</p>
              <p className="font-bold text-gray-900 dark:text-white">{trend.topic}</p>
              <p className="text-sm text-twitter-gray">{trend.posts} Tweets</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Who to Follow */}
      {following.length > 0 && (
        <motion.div
          className="bg-twitter-light dark:bg-twitter-darker rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Who you're following
          </h2>
          <div className="space-y-3">
            {following.map((user, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between hover:bg-white dark:hover:bg-twitter-dark p-2 rounded-lg cursor-pointer transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-twitter-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {user.name}
                    </p>
                    <p className="text-twitter-gray text-sm">@{user.name?.toLowerCase().replace(' ', '')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RightSidebar;