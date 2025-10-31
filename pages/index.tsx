import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaRocket, FaEthereum, FaUsers, FaChartLine, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import CampaignCard from '../components/CampaignCard';
import { useWeb3 } from '../hooks/useWeb3';
import Link from 'next/link';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { getCampaignMetadata } from '../utils/campaignStorage';

const Home: React.FC = () => {
  const { factoryContract, getCampaignContract } = useWeb3();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalFunding: '0',
    totalContributors: 0,
  });

  useEffect(() => {
    loadCampaigns();
  }, [factoryContract]);

  const loadCampaigns = async () => {
    if (!factoryContract) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Try to get deployed campaigns
      let addresses: string[] = [];
      try {
        addresses = await factoryContract.getDeployedCampaigns();
      } catch (error: any) {
        console.error('Error getting deployed campaigns:', error);
        // If the function doesn't exist or returns an error, assume no campaigns
        addresses = [];
      }

      if (addresses.length === 0) {
        setCampaigns([]);
        setStats({
          totalCampaigns: 0,
          totalFunding: '0',
          totalContributors: 0,
        });
        return;
      }

      const campaignPromises = addresses.map(async (address: string) => {
        try {
          const campaign = getCampaignContract(address);
          if (!campaign) return null;

          const summary = await campaign.getSummary();
          const metadata = getCampaignMetadata(address);

          return {
            address,
            minimumContribution: summary[0].toString(),
            balance: ethers.formatEther(summary[1]),
            requestsCount: summary[2].toString(),
            approversCount: summary[3].toString(),
            manager: summary[4],
            title: metadata?.title || `Campaign ${address.slice(0, 8)}...`,
            description: metadata?.description || 'No description available for this campaign.',
          };
        } catch (error) {
          console.error(`Error loading campaign ${address}:`, error);
          return null;
        }
      });

      const campaignData = (await Promise.all(campaignPromises)).filter(Boolean);
      setCampaigns(campaignData);

      // Calculate stats
      const totalFunding = campaignData.reduce((acc, c) => acc + (c ? parseFloat(c.balance) : 0), 0);
      const totalContributors = campaignData.reduce((acc, c) => acc + (c ? parseInt(c.approversCount) : 0), 0);

      setStats({
        totalCampaigns: campaignData.length,
        totalFunding: totalFunding.toFixed(4),
        totalContributors,
      });
    } catch (error) {
      console.error('Error loading campaigns:', error);
      // Don't show error toast for initial load, just set empty campaigns
      setCampaigns([]);
      setStats({
        totalCampaigns: 0,
        totalFunding: '0',
        totalContributors: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>FundChain - Decentralized Crowdfunding Platform</title>
        <meta name="description" content="Create and contribute to transparent crowdfunding campaigns powered by blockchain technology" />
      </Head>

      {/* Testnet Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 px-4 text-center sticky top-16 z-40 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
          <FaExclamationTriangle className="text-xl" />
          <span className="font-bold">TESTNET ONLY - Using Sepolia Network</span>
          <span className="hidden md:inline">|</span>
          <Link href="/getting-started">
            <span className="underline cursor-pointer hover:text-yellow-100">
              Get FREE Test ETH →
            </span>
          </Link>
        </div>
      </motion.div>

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
          <HiSparkles className="text-yellow-500" />
          <span className="text-primary-700 font-medium">Powered by Ethereum Blockchain</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Crowdfunding Reimagined
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Create and contribute to transparent, decentralized campaigns powered by smart contracts.
          Every transaction is secure, verifiable, and controlled by the community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-btn flex items-center space-x-2"
            >
              <FaPlus />
              <span>Create Campaign</span>
            </motion.button>
          </Link>
          <Link href="/how-it-works">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
            >
              Learn How It Works
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
            <FaRocket className="text-primary-600 text-xl" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalCampaigns}</h3>
          <p className="text-gray-600">Active Campaigns</p>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-xl mb-4">
            <FaEthereum className="text-secondary-600 text-xl" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalFunding} ETH</h3>
          <p className="text-gray-600">Total Funding</p>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
            <FaUsers className="text-green-600 text-xl" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalContributors}</h3>
          <p className="text-gray-600">Contributors</p>
        </div>
      </motion.div>

      {/* Campaigns Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Active Campaigns
          </h2>
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <FaPlus />
              <span>Create New</span>
            </motion.button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-96 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-t-2xl" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-12 bg-gray-200 rounded" />
                    ))}
                  </div>
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.address}
                {...campaign}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass-card rounded-2xl"
          >
            <FaRocket className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Campaigns Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create a campaign!</p>
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gradient-btn"
              >
                Create First Campaign
              </motion.button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
    </>
  );
};

export default Home;