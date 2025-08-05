import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-twitter-dark">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 border-x border-twitter-extraLightGray dark:border-twitter-darker">
          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Layout;