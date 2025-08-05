import React from 'react';
import { Search } from 'lucide-react';

const Explore = () => {
  return (
    <div className="max-w-2xl mx-auto border-x border-twitter-extraLightGray min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-twitter-extraLightGray z-10">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-twitter-darkGray" size={20} />
            <input
              type="text"
              placeholder="Search X"
              className="w-full pl-12 pr-4 py-3 bg-twitter-extraExtraLightGray rounded-full border-none outline-none focus:ring-2 focus:ring-twitter-blue"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <Search size={64} className="text-twitter-lightGray mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-twitter-black mb-2">
            Search for people and topics
          </h2>
          <p className="text-twitter-darkGray">
            Find what you're interested in and discover new conversations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Explore;