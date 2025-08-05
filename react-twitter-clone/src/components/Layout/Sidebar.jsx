import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Twitter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-twitter-dark border-r border-twitter-extraLightGray dark:border-twitter-darker p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 p-3">
        <Twitter className="w-8 h-8 text-twitter-blue" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`sidebar-item ${
                  isActive
                    ? 'bg-twitter-lightBlue dark:bg-twitter-darker text-twitter-blue'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xl font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <motion.button
        onClick={toggleTheme}
        className="sidebar-item mb-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        <span className="text-xl font-medium">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </motion.button>

      {/* User Profile & Logout */}
      {user && (
        <div className="border-t border-twitter-extraLightGray dark:border-twitter-darker pt-4">
          <div className="flex items-center space-x-3 p-3 mb-2">
            <div className="w-10 h-10 bg-twitter-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-sm text-twitter-gray truncate">@{user.username}</p>
            </div>
          </div>
          
          <motion.button
            onClick={handleLogout}
            className="sidebar-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xl font-medium">Logout</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;