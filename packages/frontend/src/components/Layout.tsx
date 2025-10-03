import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSafeDynamicContext } from '../context/DynamicContext';

const Layout = () => {
  // Get the context directly - now it's safe because we're inside a provider
  const contextData = useSafeDynamicContext();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        user={contextData?.user} 
        handleLogOut={typeof contextData?.handleLogOut === 'function' ? contextData.handleLogOut : undefined} 
        showAuthFlow={typeof contextData?.showAuthFlow === 'function' ? contextData.showAuthFlow : undefined} 
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
