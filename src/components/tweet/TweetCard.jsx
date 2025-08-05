import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

const TweetCard = ({ tweet, onDelete, showActions = true }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const handleRetweet = (e) => {
    e.stopPropagation();
    setRetweeted(!retweeted);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
    setShowMenu(false);
  };

  const isOwnTweet = user?.username === tweet.username;

  return (
    <div className="tweet-card p-4 relative">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-twitter-blue rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {tweet.username?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-twitter-black hover:underline cursor-pointer">
                {tweet.username || 'Unknown User'}
              </span>
              <span className="text-twitter-darkGray">
                @{tweet.username || 'unknown'}
              </span>
              <span className="text-twitter-darkGray">·</span>
              <span className="text-twitter-darkGray text-sm">
                {formatDate(tweet.dateTime)}
              </span>
            </div>

            {/* More Options */}
            {showActions && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-2 hover:bg-twitter-extraExtraLightGray rounded-full transition-colors duration-200"
                >
                  <MoreHorizontal size={16} className="text-twitter-darkGray" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-twitter-extraLightGray rounded-lg shadow-lg z-10 min-w-[120px]">
                    {isOwnTweet && (
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 flex items-center space-x-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tweet Text */}
          <div className="mt-2">
            <p className="text-twitter-black text-base leading-relaxed whitespace-pre-wrap">
              {tweet.tweet}
            </p>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center justify-between mt-4 max-w-md">
              <button className="flex items-center space-x-2 text-twitter-darkGray hover:text-twitter-blue transition-colors duration-200 group">
                <div className="p-2 rounded-full group-hover:bg-twitter-blue/10 transition-colors duration-200">
                  <MessageCircle size={18} />
                </div>
                <span className="text-sm">{tweet.replies || 0}</span>
              </button>

              <button 
                onClick={handleRetweet}
                className={cn(
                  "flex items-center space-x-2 transition-colors duration-200 group",
                  retweeted ? "text-green-500" : "text-twitter-darkGray hover:text-green-500"
                )}
              >
                <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors duration-200">
                  <Repeat2 size={18} />
                </div>
                <span className="text-sm">0</span>
              </button>

              <button 
                onClick={handleLike}
                className={cn(
                  "flex items-center space-x-2 transition-colors duration-200 group",
                  liked ? "text-red-500" : "text-twitter-darkGray hover:text-red-500"
                )}
              >
                <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors duration-200">
                  <Heart size={18} className={liked ? "fill-current" : ""} />
                </div>
                <span className="text-sm">{tweet.likes || 0}</span>
              </button>

              <button className="flex items-center space-x-2 text-twitter-darkGray hover:text-twitter-blue transition-colors duration-200 group">
                <div className="p-2 rounded-full group-hover:bg-twitter-blue/10 transition-colors duration-200">
                  <Share size={18} />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TweetCard;