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

    setIsContributing(true);
    const loadingToast = toast.loading('Processing contribution...');

    try {
      const campaignContract = getCampaignContract(address as string);
      if (!campaignContract) throw new Error('Contract not loaded');

      const tx = await campaignContract.contribute({
        value: ethers.parseEther(contributionAmount),
      });

      toast.loading('Transaction submitted. Waiting for confirmation...', { id: loadingToast });
      await tx.wait();

      toast.success('Contribution successful!', { id: loadingToast });
      setContributionAmount('');
      loadCampaignDetails(); // Reload to update stats
    } catch (error: any) {
      console.error('Error contributing:', error);
      toast.error(error?.reason || 'Failed to contribute', { id: loadingToast });
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 mb-8"
      >
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Campaign Details
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <FaEthereum className="text-2xl text-primary-500" />
              <span className="text-xs text-gray-500">Balance</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{campaign.balance} ETH</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-2xl text-secondary-500" />
              <span className="text-xs text-gray-500">Contributors</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{campaign.approversCount}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <FaClipboardList className="text-2xl text-green-500" />
              <span className="text-xs text-gray-500">Requests</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{campaign.requestsCount}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <HiSparkles className="text-2xl text-yellow-500" />
              <span className="text-xs text-gray-500">Min. Contribution</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{campaign.minimumContribution} Wei</p>
          </div>
        </div>

        {/* Contribution Form */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Contribute to this Campaign</h3>
          <div className="flex gap-4">
            <input
              type="number"
              step="0.001"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContribute}
              disabled={isContributing || !account}
              className="gradient-btn px-8"
            >
              {isContributing ? 'Contributing...' : 'Contribute'}
            </motion.button>
          </div>
          {!account && (
            <p className="text-sm text-gray-600 mt-2">Connect your wallet to contribute</p>
          )}
        </div>
      </motion.div>

      {/* Spending Requests Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Spending Requests</h2>
          {account?.toLowerCase() === campaign.manager?.toLowerCase() && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="flex items-center space-x-2 gradient-btn"
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
            className="bg-white rounded-xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Request</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                placeholder="Request description"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                step="0.001"
                value={newRequest.amount}
                onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                placeholder="Amount in ETH"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                value={newRequest.recipient}
                onChange={(e) => setNewRequest({ ...newRequest, recipient: e.target.value })}
                placeholder="Recipient address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleCreateRequest}
                  disabled={isCreatingRequest}
                  className="gradient-btn flex-1"
                >
                  {isCreatingRequest ? 'Creating...' : 'Create Request'}
                </button>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Requests List */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 ${
                  request.complete ? 'opacity-75' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{request.description}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Amount:</span> {request.value} ETH
                      </div>
                      <div>
                        <span className="font-medium">Recipient:</span>{' '}
                        <span className="font-mono text-xs">
                          {request.recipient.slice(0, 6)}...{request.recipient.slice(-4)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Approvals:</span> {request.approvalCount}/{campaign.approversCount}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Status:</span>
                        {request.complete ? (
                          <span className="flex items-center text-green-600">
                            <FaCheckCircle className="mr-1" /> Complete
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-600">
                            <FaTimesCircle className="mr-1" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!request.complete && (
                  <div className="flex gap-4 mt-4">
                    {account && (
                      <button
                        onClick={() => handleApproveRequest(index)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {account?.toLowerCase() === campaign.manager?.toLowerCase() &&
                      Number(request.approvalCount) > Number(campaign.approversCount) / 2 && (
                        <button
                          onClick={() => handleFinalizeRequest(index)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Finalize
                        </button>
                      )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaClipboardList className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No spending requests yet</p>
          </div>
        )}
      </motion.div>
    </div>
    </>
  );
};

export default CampaignDetails;