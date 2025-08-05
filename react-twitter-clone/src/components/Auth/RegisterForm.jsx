import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
    setIsLoading(false);
  };

  const passwordStrength = {
    length: formData.password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-twitter-dark flex items-center justify-center p-4">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Account Created Successfully!
          </h2>
          <p className="text-twitter-gray mb-6">
            Redirecting you to login page...
          </p>
          <div className="loading-spinner mx-auto"></div>
        </motion.div>
      </div>
    );
  }

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
            Join Twitter today
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
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Full Name"
              />
            </div>

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

            <div>
              <label htmlFor="gender" className="sr-only">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <p className="text-sm text-twitter-gray">Password requirements:</p>
                <div className="space-y-1">
                  {Object.entries({
                    'At least 6 characters': passwordStrength.length,
                    'Contains a letter': passwordStrength.hasLetter,
                    'Contains a number': passwordStrength.hasNumber,
                  }).map(([requirement, met]) => (
                    <div key={requirement} className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          met ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        {met && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className={`text-sm ${
                          met ? 'text-green-600 dark:text-green-400' : 'text-twitter-gray'
                        }`}
                      >
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading || !isPasswordValid ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !isPasswordValid ? 1 : 0.98 }}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-sm text-twitter-gray">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-twitter-blue hover:text-twitter-darkBlue transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterForm;