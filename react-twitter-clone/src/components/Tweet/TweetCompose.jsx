import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Smile, Calendar, MapPin, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tweetAPI } from '../../services/api';

const TweetCompose = ({ onTweetCreated, isModal = false, onClose }) => {
  const { user } = useAuth();
  const [tweet, setTweet] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tweet.trim() || isPosting) return;

    setIsPosting(true);
    try {
      await tweetAPI.createTweet({ tweet: tweet.trim() });
      setTweet('');
      if (onTweetCreated) {
        onTweetCreated();
      }
      if (isModal && onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const tweetLength = tweet.length;
  const maxLength = 280;
  const isOverLimit = tweetLength > maxLength;
  const canTweet = tweet.trim().length > 0 && !isOverLimit && !isPosting;

  const content = (
    <motion.div
      className={`bg-white dark:bg-twitter-dark ${
        isModal ? 'p-6' : 'border-b border-twitter-extraLightGray dark:border-twitter-darker p-4'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Modal Header */}
      {isModal && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Compose Tweet
          </h2>
          <button
            onClick={onClose}
            className="btn-ghost p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-twitter-blue rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>

          {/* Compose Area */}
          <div className="flex-1">
            <textarea
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What's happening?"
              className="w-full resize-none border-none outline-none text-xl placeholder-twitter-gray bg-transparent text-gray-900 dark:text-white"
              rows={isFocused || isModal ? 4 : 2}
              maxLength={maxLength + 50} // Allow typing over limit to show error
            />

            {/* Tweet Options */}
            {(isFocused || isModal) && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Media Options */}
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    type="button"
                    className="btn-ghost text-twitter-blue"
                    title="Add photo or video"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-twitter-blue"
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-twitter-blue"
                    title="Schedule tweet"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-twitter-blue"
                    title="Add location"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>

                {/* Character Count & Tweet Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Character Counter */}
                    <div className="relative">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-twitter-extraLightGray dark:text-twitter-gray"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={`${
                            isOverLimit
                              ? 'text-red-500'
                              : tweetLength > maxLength * 0.8
                              ? 'text-yellow-500'
                              : 'text-twitter-blue'
                          }`}
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray={`${(tweetLength / maxLength) * 100}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      {tweetLength > maxLength * 0.8 && (
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                            isOverLimit ? 'text-red-500' : 'text-twitter-gray'
                          }`}
                        >
                          {maxLength - tweetLength}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tweet Button */}
                  <motion.button
                    type="submit"
                    disabled={!canTweet}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-200 ${
                      canTweet
                        ? 'bg-twitter-blue hover:bg-twitter-darkBlue text-white'
                        : 'bg-twitter-lightBlue text-twitter-blue cursor-not-allowed opacity-50'
                    }`}
                    whileHover={canTweet ? { scale: 1.05 } : {}}
                    whileTap={canTweet ? { scale: 0.95 } : {}}
                  >
                    {isPosting ? 'Tweeting...' : 'Tweet'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );

  if (isModal) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default TweetCompose;