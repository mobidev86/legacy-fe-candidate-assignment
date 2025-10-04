import { Link } from 'react-router-dom';
import Logo from './Logo';
import LoadingSpinner from './LoadingSpinner';
import AuthButton from './AuthButton';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Define props interface
interface NavbarProps {
  user?: any;
  primaryWallet?: any;
  handleLogOut?: () => void;
  showAuthFlow?: () => void;
  isAuthenticated?: boolean;
}

const Navbar = ({ user, primaryWallet, handleLogOut, showAuthFlow }: NavbarProps = {}) => {
  // Component props received from Layout
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Add a small delay to ensure the user state is properly loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);
  
  const shortenAddress = useCallback((address: string | undefined | null) => {
    if (!address || typeof address !== 'string') return 'Not connected';
    try {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    } catch (error) {
      return 'Invalid address';
    }
  }, []);
  
  // Get wallet address safely with multiple fallbacks
  const walletAddress = useMemo(() => {
    try {
      // First, try to get address from primaryWallet prop
      if (primaryWallet?.address) {
        return '' + primaryWallet.address;
      }
      
      // Fallback: Try to access address from user.primaryWallet
      if (user?.primaryWallet?.address) {
        return '' + user.primaryWallet.address;
      }
      
      // Try verifiedCredentials for embedded wallet
      const userWithCreds = user as any;
      if (userWithCreds?.verifiedCredentials && userWithCreds.verifiedCredentials.length > 0) {
        const embeddedWallet = userWithCreds.verifiedCredentials.find((cred: any) => cred.walletPublicKey);
        if (embeddedWallet?.walletPublicKey) {
          return '' + embeddedWallet.walletPublicKey;
        }
      }
      
      // Try to access walletPublicKey safely
      const walletKey = (user as any)?.walletPublicKey;
      if (walletKey) {
        return '' + walletKey;
      }
      
      return '';
    } catch (error) {
      return '';
    }
  }, [user, primaryWallet]);
  
  const displayAddress = useMemo(() => shortenAddress(walletAddress), [walletAddress, shortenAddress]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-card py-3' : 'bg-white/80 backdrop-blur-lg py-4'}`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Logo />
            
            {/* Desktop Navigation Links */}
            <div className="ml-10 space-x-6 hidden lg:flex">
              <Link to="/" className="text-dark-600 hover:text-primary-600 font-medium transition-colors">
                Home
              </Link>
              {user && (
                <Link to="/sign-message" className="text-dark-600 hover:text-primary-600 font-medium transition-colors">
                  Sign Message
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-dark-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Auth Section */}
          <div className="hidden lg:block">
            {isLoading ? (
              <div className="w-32 h-10 flex items-center justify-center">
                <LoadingSpinner size="sm" message="" />
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-dark-800">
                      {displayAddress}
                    </span>
                    {user?.email && (
                      <span className="text-xs text-dark-500">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>
                <AuthButton
                  user={user}
                  handleLogOut={handleLogOut}
                  size="sm"
                />
              </div>
            ) : (
              <AuthButton
                showAuthFlow={showAuthFlow}
                user={user}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg animate-fade-in"
        >
          <div className="container-custom py-4 space-y-4">
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block px-4 py-2 text-dark-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {user && (
                <Link 
                  to="/sign-message" 
                  className="block px-4 py-2 text-dark-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Message
                </Link>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-dark-800">
                        {displayAddress}
                      </span>
                      {user?.email && (
                        <span className="text-xs text-dark-500">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <AuthButton
                    user={user}
                    handleLogOut={useCallback(() => {
                      handleLogOut?.();
                      setIsMobileMenuOpen(false);
                    }, [handleLogOut])}
                    fullWidth={true}
                  />
                </div>
              ) : (
                <AuthButton
                  showAuthFlow={useCallback(() => {
                    showAuthFlow?.();
                    setIsMobileMenuOpen(false);
                  }, [showAuthFlow])}
                  user={user}
                  fullWidth={true}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
