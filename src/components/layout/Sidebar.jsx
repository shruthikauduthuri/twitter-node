import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  Bookmark, 
  User, 
  Settings,
  LogOut,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-twitter-extraLightGray flex flex-col">
      {/* Logo */}
      <div className="p-4">
        <Link to="/" className="text-2xl font-bold text-twitter-blue">
          𝕏
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'bg-twitter-extraExtraLightGray text-twitter-blue font-bold'
                      : 'text-twitter-black hover:bg-twitter-extraExtraLightGray'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-xl">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Tweet Button */}
        <div className="mt-8 px-2">
          <Button className="w-full text-lg py-4">
            Tweet
          </Button>
        </div>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-twitter-extraLightGray">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-twitter-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-twitter-black truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-twitter-darkGray text-sm truncate">
                @{user?.username || 'username'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-twitter-darkGray hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;