import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  FaRocket,
  FaEthereum,
  FaUsers,
  FaVoteYea,
  FaCheckCircle,
  FaWallet,
  FaHandshake,
  FaShieldAlt,
  FaChartLine
} from 'react-icons/fa';
import { HiSparkles, HiLightBulb } from 'react-icons/hi';
import { MdSecurity, MdTimeline } from 'react-icons/md';
import Link from 'next/link';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FaWallet className="text-3xl" />,
      title: "Connect Your Wallet",
      description: "Install MetaMask and connect to the Sepolia testnet to interact with campaigns",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <FaRocket className="text-3xl" />,
      title: "Create Campaign",
      description: "Launch your project with a minimum contribution requirement and funding goal",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <FaEthereum className="text-3xl" />,
      title: "Receive Contributions",
      description: "Contributors send ETH directly to the smart contract, becoming campaign approvers",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: "Create Spending Request",
      description: "Campaign managers propose how to spend funds with detailed descriptions",
      color: "from-green-400 to-green-600"
    },
    {
      icon: <FaVoteYea className="text-3xl" />,
      title: "Democratic Voting",
      description: "Contributors vote on spending requests - need over 50% approval to proceed",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      icon: <FaCheckCircle className="text-3xl" />,
      title: "Execute Approved Requests",
      description: "Once approved, funds are automatically released to the specified recipient",
      color: "from-red-400 to-red-600"
    }
  ];

  const features = [
    {
      icon: <MdSecurity className="text-4xl text-blue-500" />,
      title: "Smart Contract Security",
      description: "Funds are held in audited smart contracts, not by any individual or company"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-500" />,
      title: "Transparent Transactions",
      description: "Every transaction is recorded on the blockchain and publicly verifiable"
    },
    {
      icon: <FaUsers className="text-4xl text-purple-500" />,
      title: "Community Control",
      description: "Contributors have voting rights proportional to their contribution"
    },
    {
      icon: <FaChartLine className="text-4xl text-indigo-500" />,
      title: "No Platform Fees",
      description: "Only network gas fees - no hidden charges or platform percentages"
    }
  ];

  const comparison = [
    {
      feature: "Platform Fees",
      traditional: "5-8% + payment processing",
      fundchain: "0% (only gas fees)"
    },
    {
      feature: "Fund Control",
      traditional: "Platform holds funds",
      fundchain: "Smart contract custody"
    },
    {
      feature: "Transparency",
      traditional: "Limited visibility",
      fundchain: "100% on blockchain"
    },
    {
      feature: "Voting Rights",
      traditional: "No contributor voting",
      fundchain: "Democratic voting"
    },
    {
      feature: "Global Access",
      traditional: "Geographic restrictions",
      fundchain: "Available worldwide"
    },
    {
      feature: "Fund Release",
      traditional: "Platform discretion",
      fundchain: "Community approval"
    }
  ];

  return (
    <>
      <Head>
        <title>How It Works - FundChain</title>
        <meta name="description" content="Learn how FundChain's decentralized crowdfunding platform works with blockchain technology" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <HiLightBulb className="text-yellow-500" />
            <span className="text-primary-700 font-medium">Learn How FundChain Works</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Crowdfunding Revolutionized
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            FundChain uses blockchain technology to create transparent, democratic, and secure crowdfunding campaigns.
            No middleman, no hidden fees, just direct funding with community control.
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How to Get Started
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-xl p-6"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-full text-white mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Step {index + 1}: {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose FundChain?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex space-x-4"
              >
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            FundChain vs Traditional Platforms
          </h2>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-left">Traditional Platforms</th>
                    <th className="px-6 py-4 text-left">FundChain</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {row.traditional}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-medium">
                          {row.fundchain}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Smart Contract Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="text-center mb-8">
              <MdTimeline className="text-5xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Campaign Lifecycle
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-primary-600">Creation Phase</h3>
                  <p className="text-gray-600 text-sm">
                    Manager sets minimum contribution and launches campaign on blockchain
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-green-600">Funding Phase</h3>
                  <p className="text-gray-600 text-sm">
                    Contributors send ETH and receive voting rights for spending decisions
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-purple-600">Execution Phase</h3>
                  <p className="text-gray-600 text-sm">
                    Approved spending requests release funds to designated recipients
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-16"
        >
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Technical Implementation
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  🔗 Blockchain Network
                </h3>
                <p className="text-gray-600">
                  Currently deployed on Ethereum Sepolia testnet. Production deployment will use
                  Ethereum mainnet or Layer 2 solutions like Polygon for lower gas fees.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  📝 Smart Contracts
                </h3>
                <p className="text-gray-600">
                  Two main contracts: CampaignFactory for deploying new campaigns, and Campaign
                  for managing individual campaign logic including contributions and voting.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  🔒 Security Measures
                </h3>
                <p className="text-gray-600">
                  Implements reentrancy guards, access controls, and validation checks.
                  All funds are held in smart contracts with transparent, immutable rules.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  💡 Voting Mechanism
                </h3>
                <p className="text-gray-600">
                  Democratic voting requires {'>'} 50% approval from contributors. Each contributor's
                  voting power is equal regardless of contribution amount, ensuring fairness.
                </p>
              </div>
            </div>
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
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Your Campaign?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Join the future of crowdfunding. Create transparent, democratic campaigns
              powered by blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Create Campaign
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

        {/* FAQ Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <HiSparkles className="text-4xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              Have Questions?
            </h2>
            <p className="text-gray-600 mt-2">
              Check out our documentation or contact support for help getting started
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default HowItWorks;