import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSafeDynamicContext } from '../context/DynamicContext';

const HomePage = () => {
  // Get the context directly - now it's safe because we're inside a provider
  const contextData = useSafeDynamicContext();
  const user = contextData?.user;
  const showAuthFlow = contextData?.showAuthFlow;
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simple loading state for UI elements
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-16 md:pt-24">
      {/* Hero Section */}
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column - Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Web3 Message Signer</span>
              <span className="block text-dark-900">& Signature Verifier</span>
            </h1>
            
            <p className="text-xl text-dark-600 mb-8 max-w-2xl">
              Securely sign messages with your Ethereum wallet and verify signatures with cryptographic proof. Built with Dynamic.xyz's embedded wallet solution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isLoading ? (
                <div className="btn btn-primary btn-lg opacity-50 cursor-not-allowed">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Loading...
                </div>
              ) : user ? (
                <Link to="/sign-message" className="btn btn-primary btn-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Sign a Message
                </Link>
              ) : (
                <button 
                  onClick={() => {
                    try {
                      if (typeof showAuthFlow === 'function') {
                        showAuthFlow();
                      } else {
                        alert('Authentication is currently unavailable.');
                      }
                    } catch (error) {
                      alert('An error occurred while trying to connect.');
                    }
                  }} 
                  className="btn btn-primary btn-lg animate-slide-up" 
                  style={{animationDelay: '0.1s'}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect Wallet
                </button>
              )}
              
              <a 
                href="https://docs.dynamic.xyz/headless/headless-email" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-lg animate-slide-up"
                style={{animationDelay: '0.2s'}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Learn More
              </a>
            </div>
          </div>
          
          {/* Right Column - Hero Image */}
          <div className="lg:w-1/2 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-100 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-100 rounded-full opacity-50 blur-xl"></div>
              
              <div className="relative bg-white p-6 rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-bl-[100px] -z-10"></div>
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mr-3 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-dark-900">Sign & Verify</h3>
                      <p className="text-sm text-dark-500">Secure Message Signing</p>
                    </div>
                  </div>
                  <div className="badge badge-success">Connected</div>
                </div>
                
                <div className="mb-6">
                  <label className="input-label">Message</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm text-dark-800 mb-2">
                    I hereby confirm ownership of this wallet address.
                    <br />
                    Time: {new Date().toISOString()}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="input-label">Wallet Address</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 font-mono text-xs text-dark-800 break-all">
                    0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Sign Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container-custom py-24">
        <div className="text-center mb-16 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">Three simple steps to sign and verify messages with your Ethereum wallet</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="card hover:translate-y-[-8px] animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mr-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-dark-900">Connect Wallet</h3>
            </div>
            <p className="text-dark-600">
              Authenticate securely using Dynamic.xyz's embedded wallet solution with email authentication. No browser extensions needed.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium">Secure Authentication</span>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="card hover:translate-y-[-8px] animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center mr-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-dark-900">Sign Message</h3>
            </div>
            <p className="text-dark-600">
              Create and sign a custom message with your wallet. The signature is cryptographically linked to your wallet address.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center text-secondary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="text-sm font-medium">Cryptographic Proof</span>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="card hover:translate-y-[-8px] animate-fade-in" style={{animationDelay: '0.7s'}}>
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center mr-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-dark-900">Verify Signature</h3>
            </div>
            <p className="text-dark-600">
              Our backend verifies your signature and confirms the signer address using ethers.js, providing cryptographic verification.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center text-accent-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Instant Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-600 py-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {user ? 'Start signing messages with cryptographic proof.' : 'Connect your wallet to begin signing messages.'}
          </p>
          
          {user ? (
            <Link to="/sign-message" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Go to Message Signer
            </Link>
          ) : (
            <Link to="#hero" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg" onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Back to Top
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
