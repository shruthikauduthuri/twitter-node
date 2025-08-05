import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tweetAPI } from '../../services/api';

const TweetCard = ({ tweet, onDelete, showActions = true }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const handleDelete = async () => {
    if (!tweet.tweet_id) return;
    
    setIsDeleting(true);
    try {
      await tweetAPI.deleteTweet(tweet.tweet_id);
      if (onDelete) {
        onDelete(tweet.tweet_id);
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const isOwnTweet = user && tweet.username === user.username;

  return (
    <motion.div
      className="tweet-card p-4 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
    >
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-twitter-blue rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {(tweet.username || tweet.name || 'U').charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">
              {tweet.name || tweet.username || 'Unknown User'}
            </h3>
            <span className="text-twitter-gray">@{tweet.username || 'unknown'}</span>
            <span className="text-twitter-gray">·</span>
            <span className="text-twitter-gray text-sm">
              {formatDate(tweet.dateTime || tweet.date_time)}
            </span>
            
            {/* More Menu */}
            {isOwnTweet && showActions && (
              <div className="ml-auto relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="btn-ghost p-1"
                  disabled={isDeleting}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                
                {showMenu && (
                  <motion.div
                    className="absolute right-0 top-8 bg-white dark:bg-twitter-darker border border-twitter-extraLightGray dark:border-twitter-gray rounded-lg shadow-lg py-2 z-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Tweet Text */}
          <p className="text-gray-900 dark:text-white mb-3 leading-relaxed">
            {tweet.tweet}
          </p>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between max-w-md">
              <motion.button
                className="flex items-center space-x-2 text-twitter-gray hover:text-twitter-blue group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full group-hover:bg-twitter-lightBlue dark:group-hover:bg-twitter-blue/10">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-sm">{tweet.replies || 0}</span>
              </motion.button>

              <motion.button
                className="flex items-center space-x-2 text-twitter-gray hover:text-green-500 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full group-hover:bg-green-100 dark:group-hover:bg-green-900/20">
                  <Repeat2 className="w-5 h-5" />
                </div>
                <span className="text-sm">0</span>
              </motion.button>

              <motion.button
                className="flex items-center space-x-2 text-twitter-gray hover:text-red-500 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-900/20">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-sm">{tweet.likes || 0}</span>
              </motion.button>

              <motion.button
                className="flex items-center space-x-2 text-twitter-gray hover:text-twitter-blue group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-full group-hover:bg-twitter-lightBlue dark:group-hover:bg-twitter-blue/10">
                  <Share className="w-5 h-5" />
                </div>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TweetCard;