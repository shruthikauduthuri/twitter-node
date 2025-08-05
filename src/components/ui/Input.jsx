import React from 'react';
import { cn } from '../../utils/cn';

const Input = ({ 
  label,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-twitter-black">
          {label}
        </label>
      )}
      <input
        className={cn(
          'input-field',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;