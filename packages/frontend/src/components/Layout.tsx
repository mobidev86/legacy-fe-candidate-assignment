import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSafeDynamicContext } from '../context/DynamicContext';

const Layout = () => {
  // Get the context directly - now it's safe because we're inside a provider
  let contextData;
  try {
    contextData = useSafeDynamicContext();
    console.log('Layout: contextData obtained', contextData);
  } catch (error) {
    console.error('Layout: Error getting context', error);
    contextData = {};
  }
  
  // Create fallback functions if needed
  const fallbackShowAuthFlow = () => {
    console.log('Fallback showAuthFlow called from Layout');
    alert('Authentication is currently unavailable. Please try again later.');
  };
  
  const fallbackHandleLogOut = () => {
    console.log('Fallback handleLogOut called from Layout');
    alert('Logout is currently unavailable. Please try again later.');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        user={contextData?.user} 
        handleLogOut={typeof contextData?.handleLogOut === 'function' ? contextData.handleLogOut : fallbackHandleLogOut} 
        showAuthFlow={typeof contextData?.showAuthFlow === 'function' ? contextData.showAuthFlow : fallbackShowAuthFlow} 
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
