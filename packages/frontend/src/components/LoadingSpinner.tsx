import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  // Define size classes
  const sizeClasses = {
    sm: 'h-8 w-8 border-t-2 border-b-2',
    md: 'h-12 w-12 border-t-3 border-b-3',
    lg: 'h-16 w-16 border-t-4 border-b-4',
  };

  const spinnerElement = (
    <div className={`text-center ${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-primary-600 mx-auto mb-4`}></div>
      {message && <p className="text-dark-600 font-medium">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default LoadingSpinner;
