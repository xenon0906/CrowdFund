import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  FaWallet,
  FaEthereum,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCopy,
  FaExternalLinkAlt,
  FaQuestionCircle,
  FaShieldAlt
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { MdSecurity, MdWarning } from 'react-icons/md';
import Link from 'next/link';
import toast from 'react-hot-toast';

const GettingStarted: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const contractAddress = '0x3015522014338929E2c7ddc438df092b993eFF38';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const faucets = [
    {
      name: 'Google Cloud Web3 Faucet',
      url: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
      amount: '0.5 Sepolia ETH',
      frequency: 'Once per day',
      requirements: 'Google account required',
      recommended: true
    },
    {
      name: 'Alchemy Sepolia Faucet',
      url: 'https://sepoliafaucet.com',
      amount: '0.5 Sepolia ETH',
      frequency: 'Once per day',
      requirements: 'Free Alchemy account'
    },
    {
      name: 'QuickNode Faucet',
      url: 'https://faucet.quicknode.com/ethereum/sepolia',
      amount: '0.1-0.5 ETH',
      frequency: 'Multiple times',
      requirements: 'QuickNode account'
    },
    {
      name: 'Chainlink Faucet',
      url: 'https://faucets.chain.link/sepolia',
      amount: '0.1 Sepolia ETH',
      frequency: 'Once per day',
      requirements: 'GitHub account'
    }
  ];

  const steps = [
    {
      title: 'Install MetaMask',
      icon: <FaWallet />,
      description: 'Download and install the MetaMask browser extension',
      link: 'https://metamask.io/download/',
      details: [
        'Go to metamask.io',
        'Click "Download" for your browser',
        'Create a new wallet or import existing',
        'Secure your recovery phrase safely'
      ]
    },
    {
      title: 'Switch to Sepolia Network',
      icon: <FaEthereum />,
      description: 'Connect to Sepolia testnet in MetaMask',
      details: [
        'Open MetaMask extension',
        'Click the network dropdown (top center)',
        'Select "Show test networks" in settings',
        'Choose "Sepolia test network"'
      ]
    },
    {
      title: 'Get Free Test ETH',
      icon: <HiLightningBolt />,
      description: 'Claim Sepolia ETH from a faucet',
      details: [
        'Copy your wallet address from MetaMask',
        'Visit one of the faucets below',
        'Paste your address and request ETH',
        'Wait 30 seconds to 2 minutes for arrival'
      ]
    }
  ];

  const securityTips = [
    {
      icon: <MdSecurity className="text-green-500 text-2xl" />,
      title: 'Never Share Private Keys',
      description: 'Your private key and seed phrase should never be shared with anyone, including support staff.'
    },
    {
      icon: <FaShieldAlt className="text-blue-500 text-2xl" />,
      title: 'Verify Contract Address',
      description: 'Always verify you\'re interacting with the correct contract address before sending transactions.'
    },
    {
      icon: <FaExclamationTriangle className="text-yellow-500 text-2xl" />,
      title: 'Use Test Networks First',
      description: 'Practice on Sepolia testnet before using real ETH on mainnet. Test ETH has no real value.'
    },
    {
      icon: <MdWarning className="text-red-500 text-2xl" />,
      title: 'Check Gas Prices',
      description: 'Always review gas fees before confirming transactions. High network congestion increases costs.'
    }
  ];

  return (
    <>
      <Head>
        <title>Getting Started - FundChain Testnet Guide</title>
        <meta name="description" content="Complete guide to get started with FundChain on Sepolia testnet. Get free test ETH and start crowdfunding." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-6 py-3 bg-yellow-100 border-2 border-yellow-300 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <FaExclamationTriangle className="text-yellow-600" />
            <span className="text-yellow-800 font-bold">TESTNET ONLY - No Real Money Required!</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Getting Started with FundChain
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            FundChain runs on <span className="font-bold text-primary-600">Ethereum Sepolia Testnet</span>.
            You'll need <span className="font-bold">FREE test ETH</span> to interact with the platform.
            No real money is involved!
          </p>

          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <FaCheckCircle className="text-green-600" />
            <span className="text-green-800">100% Free to Use - Test Network Only</span>
          </motion.div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <HiSparkles className="text-3xl text-purple-500 mt-1" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Important: This is a Testnet Application
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Sepolia ETH is FREE</strong> - Get it from faucets below</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>No real money involved</strong> - Perfect for learning and testing</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Same functionality as mainnet</strong> - Experience real blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>Safe to experiment</strong> - No financial risk</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Start Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Quick Start in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xl">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-gray-200">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {step.title}
                </h3>

                <p className="text-gray-600 mb-4">
                  {step.description}
                </p>

                <ul className="space-y-2 text-sm">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>

                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium mt-4"
                  >
                    <span>Visit Site</span>
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sepolia ETH Faucets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Get FREE Sepolia Test ETH
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faucets.map((faucet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`glass-card rounded-xl p-6 ${faucet.recommended ? 'border-2 border-green-400' : ''}`}
              >
                {faucet.recommended && (
                  <div className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
                    <FaCheckCircle />
                    <span>Recommended</span>
                  </div>
                )}

                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {faucet.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-green-600">{faucet.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{faucet.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Requirements:</span>
                    <span className="text-sm">{faucet.requirements}</span>
                  </div>
                </div>

                <a
                  href={faucet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full gradient-btn flex items-center justify-center space-x-2"
                >
                  <span>Get Test ETH</span>
                  <FaExternalLinkAlt />
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              <FaQuestionCircle className="inline mr-2" />
              Having trouble? Try multiple faucets or wait a few minutes for the transaction to process.
            </p>
          </motion.div>
        </motion.div>

        {/* Contract Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Smart Contract Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-2">
                  Factory Contract Address (Sepolia)
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-4 py-3 bg-white rounded-lg border border-gray-300 font-mono text-sm break-all">
                    {contractAddress}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(contractAddress)}
                    className="p-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    {copiedAddress ? <FaCheckCircle /> : <FaCopy />}
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Network</label>
                  <div className="px-4 py-3 bg-white rounded-lg border border-gray-300">
                    <span className="font-medium">Ethereum Sepolia Testnet</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Chain ID</label>
                  <div className="px-4 py-3 bg-white rounded-lg border border-gray-300">
                    <span className="font-medium">11155111</span>
                  </div>
                </div>
              </div>

              <a
                href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <span>View on Etherscan</span>
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Security Best Practices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="flex space-x-4"
              >
                <div className="flex-shrink-0">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-gray-800">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <div className="glass-card rounded-2xl p-12 bg-gradient-to-r from-primary-500 to-secondary-500">
            <HiLightningBolt className="text-5xl text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Once you have Sepolia ETH in your wallet, you can create campaigns,
              contribute to projects, and vote on spending decisions!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Create Your First Campaign
                </motion.button>
              </Link>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  Browse Campaigns
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default GettingStarted;