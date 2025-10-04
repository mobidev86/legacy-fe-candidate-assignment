import React from 'react';
import Button from './Button';

interface AuthButtonProps {
  showAuthFlow?: () => void;
  handleLogOut?: () => void;
  user?: any;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  showAuthFlow,
  handleLogOut,
  user,
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  // Icons for the buttons
  const disconnectIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
  
  const connectIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );

  // Safe function calls with error handling
  const handleConnect = () => {
    try {
      if (typeof showAuthFlow === 'function') {
        console.log('Using provided showAuthFlow function');
        showAuthFlow();
        return;
      }
      
      console.warn('showAuthFlow is not a function, trying fallback methods');
      
      // Try to find alternative authentication methods in order of preference
      
      // 1. Try window.dynamic.open
      if (window && (window as any).dynamic && typeof (window as any).dynamic.open === 'function') {
        console.log('Using window.dynamic.open as fallback');
        (window as any).dynamic.open();
        return;
      }
      
      // 2. Try window.dynamic.auth.openAuth
      if (window && 
          (window as any).dynamic && 
          (window as any).dynamic.auth && 
          typeof (window as any).dynamic.auth.openAuth === 'function') {
        console.log('Using window.dynamic.auth.openAuth as fallback');
        (window as any).dynamic.auth.openAuth();
        return;
      }
      
      // If all else fails, show an alert
      console.error('No authentication method available');
      alert('Authentication is currently unavailable. Please try again later.');
    } catch (error) {
      console.error('Error connecting:', error);
      alert('An error occurred while trying to connect.');
    }
  };

  const handleDisconnect = () => {
    try {
      if (typeof handleLogOut === 'function') {
        handleLogOut();
      } else {
        console.warn('handleLogOut is not a function, providing fallback behavior');
        // Try to find an alternative logout method
        if (window && (window as any).dynamic && typeof (window as any).dynamic.logout === 'function') {
          (window as any).dynamic.logout();
        } else {
          alert('Logout is currently unavailable.');
        }
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (user) {
    return (
      <Button
        variant="secondary"
        size={size}
        fullWidth={fullWidth}
        onClick={handleDisconnect}
        className={className}
        icon={disconnectIcon}
      >
        Disconnect
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      fullWidth={fullWidth}
      onClick={handleConnect}
      className={className}
      icon={connectIcon}
    >
      Connect Wallet
    </Button>
  );
};

export default AuthButton;
