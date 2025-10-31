import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Web3Provider } from '../hooks/useWeb3';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

declare global {
  interface Window {
    ethereum?: any;
    deferredPrompt?: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }

    // Handle app installation
    let deferredPrompt: any;
    const handleInstallPrompt = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      window.deferredPrompt = deferredPrompt;

      // Show install prompt on mobile after 10 seconds
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        setTimeout(() => {
          const showInstallToast = () => {
            toast.custom((t) => (
              <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm">
                <p className="font-semibold text-gray-800 mb-2">📱 Install FundChain App</p>
                <p className="text-sm text-gray-600 mb-3">Install our app for offline access and a better mobile experience!</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      if (deferredPrompt) {
                        deferredPrompt.prompt();
                        deferredPrompt.userChoice.then((choiceResult: any) => {
                          if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the install prompt');
                          }
                          deferredPrompt = null;
                        });
                      }
                      toast.dismiss(t.id);
                    }}
                    className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                  >
                    Install Now
                  </button>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            ), {
              duration: 15000,
              position: 'top-center'
            });
          };

          // Only show if not installed
          if (!window.matchMedia('(display-mode: standalone)').matches) {
            showInstallToast();
          }
        }, 10000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      console.log('FundChain app installed successfully');
      toast.success('🎉 FundChain app installed successfully!');
    });

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '10px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Web3Provider>
  );
}

export default MyApp;