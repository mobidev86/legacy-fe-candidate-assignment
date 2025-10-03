import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MessageSignerPage from './pages/MessageSignerPage';

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'REPLACE_WITH_YOUR_DYNAMIC_ENVIRONMENT_ID', // You'll need to replace this with your actual Dynamic.xyz environment ID
        walletConnectors: [EthereumWalletConnectors],
        evmNetworks: [
          {
            chainId: 1, // Ethereum Mainnet
            name: 'Ethereum',
            displayName: 'Ethereum',
          },
        ],
      }}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/sign-message" element={<MessageSignerPage />} />
        </Route>
      </Routes>
    </DynamicContextProvider>
  );
}

export default App;
