// Type declaration overrides for @dynamic-labs packages
declare module '@dynamic-labs/ethereum-core' {
  // Add empty declarations to override problematic types
}

declare module '@dynamic-labs/ethereum' {
  export const EthereumWalletConnectors: any;
}

declare module '@dynamic-labs/sdk-react-core' {
  export interface DynamicContext {
    user: any;
    primaryWallet: any;
    showAuthFlow: () => void;
    handleLogOut: () => void;
  }
  
  export function useDynamicContext(): DynamicContext;
  
  export interface DynamicContextProviderProps {
    settings: any;
    children: React.ReactNode;
  }
  
  export function DynamicContextProvider(props: DynamicContextProviderProps): JSX.Element;
}
