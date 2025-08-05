import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { tweetAPI, userAPI } from '../services/api';
import TweetCard from '../components/tweet/TweetCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();
  const [userTweets, setUserTweets] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tweets');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [tweetsRes, followersRes, followingRes] = await Promise.all([
        tweetAPI.getUserTweets(),
        userAPI.getFollowers(),
        userAPI.getFollowing(),
      ]);

      setUserTweets(tweetsRes.data);
      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      await tweetAPI.deleteTweet(tweetId);
      await fetchProfileData(); // Refresh data
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  const tabs = [
    { id: 'tweets', label: 'Tweets', count: userTweets.length },
    { id: 'replies', label: 'Replies', count: 0 },
    { id: 'media', label: 'Media', count: 0 },
    { id: 'likes', label: 'Likes', count: 0 },
  ];

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto border-x border-twitter-extraLightGray min-h-screen">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto border-x border-twitter-extraLightGray min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-twitter-extraLightGray z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-twitter-black">{user?.name}</h1>
          <p className="text-sm text-twitter-darkGray">{userTweets.length} Tweets</p>
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
            <div className="w-32 h-32 bg-twitter-blue rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white font-bold text-4xl">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-end mb-4">
            <Button variant="secondary" size="sm">
              Edit profile
            </Button>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-twitter-black">{user?.name}</h2>
              <p className="text-twitter-darkGray">@{user?.username}</p>
            </div>

            <div className="flex items-center space-x-4 text-twitter-darkGray">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span className="text-sm">Joined January 2024</span>
              </div>
            </div>

            {/* Following/Followers */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-twitter-black">{following.length}</span>
                <span className="text-twitter-darkGray">Following</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-twitter-black">{followers.length}</span>
                <span className="text-twitter-darkGray">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-twitter-extraLightGray">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-4 text-center font-medium transition-colors duration-200 relative ${
                activeTab === tab.id
                  ? 'text-twitter-black'
                  : 'text-twitter-darkGray hover:text-twitter-black'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-1 text-sm text-twitter-darkGray">({tab.count})</span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-twitter-blue rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'tweets' && (
          <div>
            {userTweets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-twitter-darkGray text-lg">No tweets yet</p>
                <p className="text-twitter-darkGray text-sm mt-2">
                  When you post tweets, they'll show up here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-twitter-extraLightGray">
                {userTweets.map((tweet, index) => (
                  <TweetCard
                    key={`user-tweet-${index}`}
                    tweet={{
                      ...tweet,
                      username: user?.username,
                    }}
                    onDelete={() => handleDeleteTweet(tweet.tweet_id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab !== 'tweets' && (
          <div className="text-center py-12">
            <p className="text-twitter-darkGray text-lg">Coming soon</p>
            <p className="text-twitter-darkGray text-sm mt-2">
              This feature is not yet implemented.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;