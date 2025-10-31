import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaWallet, FaRocket, FaEthereum, FaMobileAlt, FaBars, FaTimes } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useWeb3 } from '../hooks/useWeb3';
import { useMobileWallet } from '../hooks/useMobileWallet';

const Navbar: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isLoading } = useWeb3();
  const { isMobile, isTablet, hasMetaMask, connectWallet: mobileConnect, openMetaMaskApp } = useMobileWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnect = async () => {
    if (isMobile || isTablet) {
      await mobileConnect();
    } else {
      await connectWallet();
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card sticky top-0 z-50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <FaRocket className="text-3xl text-primary-600" />
                <HiSparkles className="absolute -top-1 -right-1 text-yellow-400 text-sm animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                FundChain
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className="text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
                Campaigns
              </span>
            </Link>
            <Link href="/getting-started">
              <span className="text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer flex items-center space-x-1">
                <span>Get Started</span>
                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">Free ETH</span>
              </span>
            </Link>
            <Link href="/create">
              <span className="text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
                Create
              </span>
            </Link>
            <Link href="/how-it-works">
              <span className="text-gray-700 hover:text-primary-600 transition-colors font-medium cursor-pointer">
                How It Works
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>

          {/* Wallet Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={account ? disconnectWallet : handleConnect}
            disabled={isLoading}
            className={`
              hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all
              ${account
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                : 'gradient-btn'}
            `}
          >
            {isMobile ? <FaMobileAlt /> : <FaWallet />}
            <span>
              {isLoading
                ? 'Connecting...'
                : account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : isMobile
                ? 'Connect Mobile'
                : 'Connect Wallet'}
            </span>
            {account && <FaEthereum className="text-lg" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-gray-200 px-4 py-4"
        >
          <div className="flex flex-col space-y-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <span className="block py-2 text-gray-700">Campaigns</span>
            </Link>
            <Link href="/getting-started" onClick={() => setMobileMenuOpen(false)}>
              <span className="block py-2 text-gray-700">Get Started</span>
            </Link>
            <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
              <span className="block py-2 text-gray-700">Create</span>
            </Link>
            <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
              <span className="block py-2 text-gray-700">How It Works</span>
            </Link>

            {/* Mobile Connect Button */}
            <button
              onClick={async () => {
                await handleConnect();
                setMobileMenuOpen(false);
              }}
              disabled={isLoading}
              className={`
                flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all
                ${account
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'gradient-btn'}
              `}
            >
              <FaMobileAlt className="text-lg" />
              <span>
                {isLoading
                  ? 'Connecting...'
                  : account
                  ? `${account.slice(0, 6)}...${account.slice(-4)}`
                  : 'Connect MetaMask'}
              </span>
            </button>

            {/* Install App Button for Mobile */}
            {isMobile && (
              <button
                onClick={() => {
                  if ((window as any).deferredPrompt) {
                    (window as any).deferredPrompt.prompt();
                  }
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium"
              >
                <FaMobileAlt />
                <span>Install App</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;