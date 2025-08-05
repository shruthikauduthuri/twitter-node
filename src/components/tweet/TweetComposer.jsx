import React, { useState } from 'react';
import { Image, Smile, Calendar, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const TweetComposer = ({ onTweet, loading = false }) => {
  const { user } = useAuth();
  const [tweetText, setTweetText] = useState('');
  const maxLength = 280;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tweetText.trim() && onTweet) {
      await onTweet(tweetText.trim());
      setTweetText('');
    }
  };

  const remainingChars = maxLength - tweetText.length;
  const isOverLimit = remainingChars < 0;
  const isEmpty = tweetText.trim().length === 0;

  return (
    <div className="border-b border-twitter-extraLightGray p-4">
      <div className="flex space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-twitter-blue rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>

        {/* Composer */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              placeholder="What's happening?"
              className="w-full text-xl placeholder-twitter-darkGray resize-none border-none outline-none bg-transparent"
              rows={3}
              maxLength={maxLength + 50} // Allow typing over limit to show warning
            />

            {/* Tweet Options */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="p-2 text-twitter-blue hover:bg-twitter-blue/10 rounded-full transition-colors duration-200"
                  title="Add image"
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-twitter-blue hover:bg-twitter-blue/10 rounded-full transition-colors duration-200"
                  title="Add emoji"
                >
                  <Smile size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-twitter-blue hover:bg-twitter-blue/10 rounded-full transition-colors duration-200"
                  title="Schedule"
                >
                  <Calendar size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-twitter-blue hover:bg-twitter-blue/10 rounded-full transition-colors duration-200"
                  title="Add location"
                >
                  <MapPin size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Character Count */}
                <div className="flex items-center space-x-2">
                  <div className="relative w-8 h-8">
                    <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-twitter-extraLightGray"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${2 * Math.PI * 14 * (1 - Math.min(tweetText.length / maxLength, 1))}`}
                        className={
                          isOverLimit 
                            ? "text-red-500" 
                            : remainingChars <= 20 
                            ? "text-yellow-500" 
                            : "text-twitter-blue"
                        }
                      />
                    </svg>
                    {remainingChars <= 20 && (
                      <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                        isOverLimit ? "text-red-500" : "text-twitter-darkGray"
                      }`}>
                        {remainingChars}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tweet Button */}
                <Button
                  type="submit"
                  disabled={isEmpty || isOverLimit}
                  loading={loading}
                  size="sm"
                >
                  Tweet
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TweetComposer;