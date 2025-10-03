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
        environmentId: '04bf994f-d77d-4356-aeab-f6f0c2a1e2c1',
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
