import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaEthereum, FaUsers, FaClipboardList, FaCheckCircle, FaTimesCircle, FaPlus } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { useWeb3 } from '../../hooks/useWeb3';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface Request {
  description: string;
  value: string;
  recipient: string;
  complete: boolean;
  approvalCount: number;
}

const CampaignDetails: React.FC = () => {
  const router = useRouter();
  const { address } = router.query;
  const { account, getCampaignContract } = useWeb3();
  const [campaign, setCampaign] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [newRequest, setNewRequest] = useState({
    description: '',
    amount: '',
    recipient: '',
  });
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    if (address) {
      loadCampaignDetails();
    }
  }, [address, getCampaignContract]);

  const loadCampaignDetails = async () => {
    if (!address || typeof address !== 'string') return;

    const campaignContract = getCampaignContract(address);
    if (!campaignContract) {
      setIsLoading(false);
      return;
    }

    try {
      const summary = await campaignContract.getSummary();
      const requestCount = parseInt(summary[2].toString());

      setCampaign({
        address,
        minimumContribution: summary[0].toString(),
        balance: ethers.formatEther(summary[1]),
        requestsCount: requestCount,
        approversCount: summary[3].toString(),
        manager: summary[4],
      });

      // Load requests
      const requestPromises = [];
      for (let i = 0; i < requestCount; i++) {
        requestPromises.push(campaignContract.requests(i));
      }

      const requestData = await Promise.all(requestPromises);
      setRequests(
        requestData.map((r) => ({
          description: r[0],
          value: ethers.formatEther(r[1]),
          recipient: r[2],
          complete: r[3],
          approvalCount: r[4].toString(),
        }))
      );
    } catch (error) {
      console.error('Error loading campaign details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContribute = async () => {
    if (!account) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error('Please enter a valid contribution amount');
      return;
    }

    // Check minimum contribution
    const contributionWei = ethers.parseEther(contributionAmount);
    const minimumWei = BigInt(campaign.minimumContribution);

    if (contributionWei < minimumWei) {
      const minEth = ethers.formatEther(minimumWei);
      toast.error(`Minimum contribution is ${minEth} ETH (${campaign.minimumContribution} Wei)`);
      return;
    }

    setIsContributing(true);
    const loadingToast = toast.loading('Processing contribution...');

    try {
      const campaignContract = getCampaignContract(address as string);
      if (!campaignContract) throw new Error('Contract not loaded');

      const tx = await campaignContract.contribute({
        value: contributionWei,
      });

      toast.loading('Transaction submitted. Waiting for confirmation...', { id: loadingToast });
      await tx.wait();

      toast.success('Contribution successful! 🎉', { id: loadingToast });
      setContributionAmount('');
      loadCampaignDetails(); // Reload to update stats
    } catch (error: any) {
      console.error('Error contributing:', error);
      const errorMessage = error?.reason || error?.message || 'Failed to contribute';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsContributing(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!account) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (account.toLowerCase() !== campaign?.manager?.toLowerCase()) {
      toast.error('Only the campaign manager can create requests');
      return;
    }

    if (!newRequest.description || !newRequest.amount || !newRequest.recipient) {
      toast.error('Please fill all fields');
      return;
    }

    setIsCreatingRequest(true);
    const loadingToast = toast.loading('Creating request...');

    try {
      const campaignContract = getCampaignContract(address as string);
      if (!campaignContract) throw new Error('Contract not loaded');

      const tx = await campaignContract.createRequest(
        newRequest.description,
        ethers.parseEther(newRequest.amount),
        newRequest.recipient
      );

      toast.loading('Transaction submitted. Waiting for confirmation...', { id: loadingToast });
      await tx.wait();

      toast.success('Request created successfully!', { id: loadingToast });
      setNewRequest({ description: '', amount: '', recipient: '' });
      setShowRequestForm(false);
      loadCampaignDetails();
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast.error(error?.reason || 'Failed to create request', { id: loadingToast });
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const handleApproveRequest = async (index: number) => {
    if (!account) {
      toast.error('Please connect your wallet first!');
      return;
    }

    const loadingToast = toast.loading('Approving request...');

    try {
      const campaignContract = getCampaignContract(address as string);
      if (!campaignContract) throw new Error('Contract not loaded');

      const tx = await campaignContract.approveRequest(index);
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: loadingToast });
      await tx.wait();

      toast.success('Request approved!', { id: loadingToast });
      loadCampaignDetails();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast.error(error?.reason || 'Failed to approve request', { id: loadingToast });
    }
  };

  const handleFinalizeRequest = async (index: number) => {
    if (!account) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (account.toLowerCase() !== campaign?.manager?.toLowerCase()) {
      toast.error('Only the campaign manager can finalize requests');
      return;
    }

    const loadingToast = toast.loading('Finalizing request...');

    try {
      const campaignContract = getCampaignContract(address as string);
      if (!campaignContract) throw new Error('Contract not loaded');

      const tx = await campaignContract.finalizeRequest(index);
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: loadingToast });
      await tx.wait();

      toast.success('Request finalized!', { id: loadingToast });
      loadCampaignDetails();
    } catch (error: any) {
      console.error('Error finalizing request:', error);
      toast.error(error?.reason || 'Failed to finalize request', { id: loadingToast });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Campaign not found</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Campaign Details - FundChain</title>
        <meta name="description" content="View campaign details, contribute funds, and vote on spending requests" />
      </Head>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Campaign Details
        </h1>

        {/* Manager Badge */}
        {account?.toLowerCase() === campaign.manager?.toLowerCase() && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm font-semibold text-green-800">
              ✓ You are the manager of this campaign
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <FaEthereum className="text-xl md:text-2xl text-primary-500" />
              <span className="text-xs text-gray-500">Balance</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-gray-800 break-words">{campaign.balance} ETH</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-xl md:text-2xl text-secondary-500" />
              <span className="text-xs text-gray-500">Contributors</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-gray-800">{campaign.approversCount}</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <FaClipboardList className="text-xl md:text-2xl text-green-500" />
              <span className="text-xs text-gray-500">Requests</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-gray-800">{campaign.requestsCount}</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <HiSparkles className="text-xl md:text-2xl text-yellow-500" />
              <span className="text-xs text-gray-500">Min. Contrib.</span>
            </div>
            <p className="text-sm md:text-lg font-bold text-gray-800">{ethers.formatEther(campaign.minimumContribution)} ETH</p>
          </div>
        </div>

        {/* Contribution Form */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contribute to this Campaign</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-3">
            Minimum: {ethers.formatEther(campaign.minimumContribution)} ETH
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <input
              type="number"
              step="0.001"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="flex-1 px-4 py-3 md:py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContribute}
              disabled={isContributing || !account}
              className="gradient-btn px-6 md:px-8 py-3 text-base md:text-base whitespace-nowrap"
            >
              {isContributing ? 'Contributing...' : 'Contribute Now'}
            </motion.button>
          </div>
          {!account && (
            <p className="text-xs md:text-sm text-gray-600 mt-2">Connect your wallet to contribute</p>
          )}
        </div>
      </motion.div>

      {/* Spending Requests Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Spending Requests</h2>
          {account?.toLowerCase() === campaign.manager?.toLowerCase() && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="flex items-center justify-center space-x-2 gradient-btn px-4 py-2 md:px-6 md:py-3 text-sm md:text-base w-full sm:w-auto"
            >
              <FaPlus />
              <span>New Request</span>
            </motion.button>
          )}
        </div>

        {/* Create Request Form */}
        {showRequestForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-xl p-4 md:p-6 mb-4 md:mb-6"
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Create New Request</h3>
            <div className="space-y-3 md:space-y-4">
              <input
                type="text"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                placeholder="Request description"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                step="0.001"
                value={newRequest.amount}
                onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                placeholder="Amount in ETH"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                value={newRequest.recipient}
                onChange={(e) => setNewRequest({ ...newRequest, recipient: e.target.value })}
                placeholder="Recipient address"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  onClick={handleCreateRequest}
                  disabled={isCreatingRequest}
                  className="gradient-btn flex-1 py-3 text-base"
                >
                  {isCreatingRequest ? 'Creating...' : 'Create Request'}
                </button>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {requests.map((request, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-4 md:p-6 ${
                  request.complete ? 'opacity-75' : ''
                }`}
              >
                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-3">{request.description}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                    <div className="flex justify-between sm:block">
                      <span className="font-medium">Amount:</span>
                      <span className="sm:ml-1">{request.value} ETH</span>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="font-medium">Recipient:</span>{' '}
                      <span className="font-mono text-xs">
                        {request.recipient.slice(0, 6)}...{request.recipient.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between sm:block">
                      <span className="font-medium">Approvals:</span>
                      <span className="sm:ml-1">{request.approvalCount}/{campaign.approversCount}</span>
                    </div>
                    <div className="flex justify-between sm:block items-center">
                      <span className="font-medium">Status:</span>
                      <span className="sm:ml-1">
                        {request.complete ? (
                          <span className="inline-flex items-center text-green-600">
                            <FaCheckCircle className="mr-1" /> Complete
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-yellow-600">
                            <FaTimesCircle className="mr-1" /> Pending
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {!request.complete && (
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mt-3 md:mt-4">
                    {account && (
                      <button
                        onClick={() => handleApproveRequest(index)}
                        className="px-4 py-2.5 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm md:text-base font-medium"
                      >
                        ✓ Approve
                      </button>
                    )}
                    {account?.toLowerCase() === campaign.manager?.toLowerCase() &&
                      Number(request.approvalCount) > Number(campaign.approversCount) / 2 && (
                        <button
                          onClick={() => handleFinalizeRequest(index)}
                          className="px-4 py-2.5 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base font-medium"
                        >
                          → Finalize
                        </button>
                      )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <FaClipboardList className="text-3xl md:text-4xl text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-sm md:text-base text-gray-500">No spending requests yet</p>
            {account?.toLowerCase() === campaign.manager?.toLowerCase() && (
              <p className="text-xs md:text-sm text-gray-400 mt-2">Create your first request above</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
    </>
  );
};

export default CampaignDetails;