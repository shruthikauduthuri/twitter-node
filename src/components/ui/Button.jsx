import React from 'react';
import { cn } from '../../utils/cn';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  const variants = {
    primary: 'bg-twitter-blue text-white hover:bg-twitter-darkBlue focus:ring-twitter-blue',
    secondary: 'border border-twitter-lightGray text-twitter-black hover:bg-twitter-extraExtraLightGray focus:ring-twitter-lightGray',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'text-twitter-darkGray hover:bg-twitter-extraExtraLightGray focus:ring-twitter-lightGray'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;