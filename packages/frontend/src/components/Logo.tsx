import { Link } from 'react-router-dom';

interface LogoProps {
  showAppText?: boolean;
  textColor?: string;
  linkTo?: string;
  className?: string;
}

const Logo = ({ 
  showAppText = true, 
  textColor = 'text-dark-800', 
  linkTo = '/',
  className = ''
}: LogoProps) => {
  return (
    <Link to={linkTo} className={`flex items-center ${className}`}>
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mr-3 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div>
        <span className="text-xl font-bold gradient-text">Web3 Signer</span>
        {showAppText && (
          <span className={`hidden sm:inline-block text-xl font-bold ${textColor} ml-1`}>App</span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
