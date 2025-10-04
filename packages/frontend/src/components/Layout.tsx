import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import { useSafeDynamicContext } from '../context/DynamicContext';

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const contextData = useSafeDynamicContext();
  
  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isLoading ? <LoadingSpinner size="lg" message="Loading application..." fullScreen={true} /> : null}
      
      <Navbar 
        user={contextData?.user} 
        primaryWallet={contextData?.primaryWallet}
        handleLogOut={contextData?.handleLogOut} 
        showAuthFlow={contextData?.showAuthFlow} 
      />
      
      <main className="flex-grow pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile navigation is now handled entirely by the Navbar component */}
      
      <Footer />
    </div>
  );
};

export default Layout;
