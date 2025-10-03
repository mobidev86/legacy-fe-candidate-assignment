const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Web3 Message Signer & Verifier</p>
          <p className="mt-1">Built with Dynamic.xyz, React, and Ethers.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
