import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(formData);
    
    if (result.success) {
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-twitter-dark flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center">
          <motion.div
            className="mx-auto w-16 h-16 bg-twitter-blue rounded-full flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Twitter className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to Twitter
          </h2>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Username"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field pr-12"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-twitter-gray" />
                ) : (
                  <Eye className="h-5 w-5 text-twitter-gray" />
                )}
              </button>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-sm text-twitter-gray">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-twitter-blue hover:text-twitter-darkBlue transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;