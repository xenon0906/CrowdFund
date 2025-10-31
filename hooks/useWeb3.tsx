import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FACTORY_ADDRESS, FACTORY_ABI, CAMPAIGN_ABI, RPC_URL, NETWORK_ID } from '../config/contracts';
import toast from 'react-hot-toast';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  factoryContract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  chainId: number | null;
  getCampaignContract: (address: string) => ethers.Contract | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  signer: null,
  factoryContract: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isLoading: false,
  chainId: null,
  getCampaignContract: () => null,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // Initialize read-only provider for non-connected users
  useEffect(() => {
    const initReadOnlyProvider = async () => {
      try {
        const readOnlyProvider = new ethers.JsonRpcProvider(RPC_URL);
        const readOnlyFactory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, readOnlyProvider);

        // Only set if no wallet is connected
        if (!account) {
          setProvider(readOnlyProvider as any);
          setFactoryContract(readOnlyFactory);
        }
      } catch (error) {
        console.error('Error initializing read-only provider:', error);
      }
    };

    initReadOnlyProvider();
  }, [account]);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask!');
        return;
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.send('eth_requestAccounts', []);
      const network = await web3Provider.getNetwork();

      if (Number(network.chainId) !== NETWORK_ID) {
        toast.error(`Please switch to Sepolia network!`);
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${NETWORK_ID.toString(16)}` }],
          });
        } catch (error) {
          console.error('Failed to switch network:', error);
        }
        return;
      }

      const web3Signer = await web3Provider.getSigner();
      const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, web3Signer);

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);
      setFactoryContract(factory);
      setChainId(Number(network.chainId));

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setFactoryContract(null);
    setChainId(null);
    toast.success('Wallet disconnected');
  };

  const getCampaignContract = (address: string) => {
    // Use signer if connected, otherwise use provider
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;
    return new ethers.Contract(address, CAMPAIGN_ABI, signerOrProvider);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await web3Provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        factoryContract,
        connectWallet,
        disconnectWallet,
        isLoading,
        chainId,
        getCampaignContract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);