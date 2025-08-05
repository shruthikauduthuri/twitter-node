import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
};

export default Layout;