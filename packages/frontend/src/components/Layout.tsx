import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import { useSafeDynamicContext } from '../context/DynamicContext';

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the context directly - now it's safe because we're inside a provider
  let contextData;
  try {
    contextData = useSafeDynamicContext();
    
    // Verify that critical functions exist
    if (contextData && typeof contextData.showAuthFlow !== 'function') {
      console.warn('showAuthFlow is missing or not a function in Layout component');
    }
    
    if (contextData && typeof contextData.handleLogOut !== 'function') {
      console.warn('handleLogOut is missing or not a function in Layout component');
    }
  } catch (error) {
    console.error('Error getting Dynamic context:', error);
    contextData = {};
  }
  
  // Mobile viewport check removed - now handled by CSS media queries
  
  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Create enhanced fallback functions with better error handling and alternative methods
  const fallbackShowAuthFlow = () => {
    console.log('Using fallback showAuthFlow in Layout');
    
    try {
      // Try to find alternative authentication methods
      if (window && (window as any).dynamic && typeof (window as any).dynamic.open === 'function') {
        console.log('Using window.dynamic.open as fallback');
        (window as any).dynamic.open();
        return;
      }
      
      // If contextData has an openWallet method, try that
      if (contextData && typeof (contextData as any).openWallet === 'function') {
        console.log('Using openWallet as fallback');
        (contextData as any).openWallet();
        return;
      }
      
      // Last resort
      alert('Authentication is currently unavailable. Please try again later.');
    } catch (error) {
      console.error('Error in fallback authentication:', error);
      alert('Authentication error. Please try again later.');
    }
  };
  
  const fallbackHandleLogOut = () => {
    console.log('Using fallback handleLogOut in Layout');
    
    try {
      // Try to find alternative logout methods
      if (window && (window as any).dynamic && typeof (window as any).dynamic.logout === 'function') {
        console.log('Using window.dynamic.logout as fallback');
        (window as any).dynamic.logout();
        return;
      }
      
      // Last resort
      alert('Logout is currently unavailable. Please try again later.');
    } catch (error) {
      console.error('Error in fallback logout:', error);
      alert('Logout error. Please try again later.');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isLoading ? <LoadingSpinner size="lg" message="Loading application..." fullScreen={true} /> : null}
      
      <Navbar 
        user={contextData?.user} 
        handleLogOut={typeof contextData?.handleLogOut === 'function' ? contextData.handleLogOut : fallbackHandleLogOut} 
        showAuthFlow={typeof contextData?.showAuthFlow === 'function' ? contextData.showAuthFlow : fallbackShowAuthFlow} 
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
