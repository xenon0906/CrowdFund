import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface MobileWalletHook {
  isMobile: boolean;
  isTablet: boolean;
  hasMetaMask: boolean;
  connectWallet: () => Promise<void>;
  openMetaMaskApp: () => void;
  generateWalletConnectQR: () => string;
}

export const useMobileWallet = (): MobileWalletHook => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent || navigator.vendor;
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const tabletCheck = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);

    setIsMobile(mobileCheck && !tabletCheck);
    setIsTablet(tabletCheck);

    // Check if MetaMask is installed
    const checkMetaMask = () => {
      if (typeof window !== 'undefined') {
        setHasMetaMask(!!(window as any).ethereum);
      }
    };

    checkMetaMask();

    // Check for MetaMask on app resume (for mobile)
    if (document) {
      document.addEventListener('visibilitychange', checkMetaMask);
      return () => document.removeEventListener('visibilitychange', checkMetaMask);
    }
  }, []);

  const connectWallet = async () => {
    try {
      // Mobile deep link to MetaMask
      if (isMobile && !hasMetaMask) {
        const deepLink = `https://metamask.app.link/dapp/${window.location.hostname}`;
        toast.loading('Opening MetaMask app...');
        window.location.href = deepLink;
        return;
      }

      // Tablet or desktop connection
      if ((window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await provider.send('eth_requestAccounts', []);
        toast.success('Wallet connected successfully!');
      } else {
        // Show installation guide
        if (isMobile) {
          toast.error('Please install MetaMask mobile app');
          setTimeout(() => {
            if (confirm('Would you like to install MetaMask?')) {
              const platform = /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android';
              const storeUrl = platform === 'ios'
                ? 'https://apps.apple.com/app/metamask/id1438144202'
                : 'https://play.google.com/store/apps/details?id=io.metamask';
              window.open(storeUrl, '_blank');
            }
          }, 1000);
        } else {
          toast.error('Please install MetaMask browser extension');
          window.open('https://metamask.io/download/', '_blank');
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const openMetaMaskApp = () => {
    if (isMobile) {
      // Deep link to open MetaMask app
      const deepLink = `metamask://dapp/${window.location.hostname}`;

      // Try to open the app
      window.location.href = deepLink;

      // Fallback to app store after 2 seconds if app doesn't open
      setTimeout(() => {
        if (document.hidden || document.visibilityState === 'hidden') {
          return; // App opened successfully
        }

        // Redirect to app store
        const platform = /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android';
        const storeUrl = platform === 'ios'
          ? 'https://apps.apple.com/app/metamask/id1438144202'
          : 'https://play.google.com/store/apps/details?id=io.metamask';

        if (confirm('MetaMask app not found. Install it from the app store?')) {
          window.open(storeUrl, '_blank');
        }
      }, 2000);
    }
  };

  const generateWalletConnectQR = () => {
    // Generate WalletConnect URI for QR code
    const wcUri = `wc:${window.location.hostname}@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=${Date.now()}`;
    return wcUri;
  };

  return {
    isMobile,
    isTablet,
    hasMetaMask,
    connectWallet,
    openMetaMaskApp,
    generateWalletConnectQR
  };
};