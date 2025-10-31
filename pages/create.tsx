import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaRocket, FaEthereum, FaInfoCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useWeb3 } from '../hooks/useWeb3';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import {
  validateMinimumContribution,
  validateCampaignTitle,
  validateCampaignDescription,
  validateAmount,
  sanitizeInput
} from '../utils/validation';

const CreateCampaign: React.FC = () => {
  const { account, factoryContract } = useWeb3();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    minimumContribution: '',
    title: '',
    description: '',
    goal: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (!factoryContract) {
      toast.error('Contract not loaded. Please refresh and try again.');
      return;
    }

    // Validate and sanitize inputs
    const sanitizedTitle = sanitizeInput(formData.title);
    const sanitizedDescription = sanitizeInput(formData.description);

    if (!validateCampaignTitle(sanitizedTitle)) {
      toast.error('Title must be between 3 and 100 characters');
      return;
    }

    if (!validateCampaignDescription(sanitizedDescription)) {
      toast.error('Description must be between 10 and 500 characters');
      return;
    }

    if (!validateMinimumContribution(formData.minimumContribution)) {
      toast.error('Please enter a valid minimum contribution (1 wei to 1 ETH in wei)');
      return;
    }

    if (formData.goal && !validateAmount(formData.goal)) {
      toast.error('Please enter a valid goal amount (max 1,000,000 ETH)');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Creating your campaign...');

    try {
      const tx = await factoryContract.createCampaign(formData.minimumContribution);
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: loadingToast });

      await tx.wait();

      toast.success('Campaign created successfully!', { id: loadingToast });
      router.push('/');
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error?.reason || 'Failed to create campaign', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Campaign - FundChain</title>
        <meta name="description" content="Launch your crowdfunding campaign on blockchain with transparent funding and democratic voting" />
      </Head>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mb-4"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <FaRocket className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Create Your Campaign
            </span>
          </h1>
          <p className="text-gray-600">Launch your project and start receiving contributions</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Give your campaign a catchy title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell people what your campaign is about..."
              required
            />
          </div>

          {/* Goal and Minimum Contribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Goal (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="10"
                />
                <FaEthereum className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Contribution (Wei) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.minimumContribution}
                  onChange={(e) => setFormData({ ...formData, minimumContribution: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="100"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="relative group">
                    <FaInfoCircle className="text-gray-400 cursor-help" />
                    <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      1 ETH = 10^18 Wei. Enter the minimum amount in Wei that contributors must send.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <HiSparkles className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Smart Contract Powered</p>
                <p>Your campaign will be deployed on the Sepolia testnet. All contributions and spending requests will be managed transparently through blockchain technology.</p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || !account}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              isLoading || !account
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'gradient-btn'
            }`}
          >
            {!account
              ? 'Connect Wallet First'
              : isLoading
              ? 'Creating Campaign...'
              : 'Create Campaign'}
          </motion.button>
        </form>
      </motion.div>
    </div>
    </>
  );
};

export default CreateCampaign;