import React from 'react';
import { motion } from 'framer-motion';
import { FaEthereum, FaUsers, FaCheckCircle, FaClock } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';

interface CampaignCardProps {
  address: string;
  title: string;
  description: string;
  balance: string;
  minimumContribution: string;
  requestsCount: string;
  approversCount: string;
  manager: string;
  index: number;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  address,
  title,
  description,
  balance,
  minimumContribution,
  requestsCount,
  approversCount,
  manager,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-xl md:rounded-2xl overflow-hidden group"
    >
      {/* Gradient Header */}
      <div className="h-24 md:h-32 bg-gradient-to-br from-primary-400 via-purple-400 to-secondary-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="relative z-10 p-4 md:p-6">
          <h3 className="text-lg md:text-2xl font-bold text-white mb-1">{title || `Campaign #${index + 1}`}</h3>
          <p className="text-white/80 text-xs md:text-sm truncate">by {manager.slice(0, 6)}...{manager.slice(-4)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-3 md:space-y-4">
        <p className="text-gray-600 line-clamp-2 text-sm md:text-base">
          {description || "Help fund this amazing project and make a difference in the community!"}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-primary-100 rounded-lg flex-shrink-0">
              <FaEthereum className="text-primary-600 text-base md:text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-gray-500">Balance</p>
              <p className="font-semibold text-sm md:text-base text-gray-800 truncate">{balance} ETH</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-secondary-100 rounded-lg flex-shrink-0">
              <FaUsers className="text-secondary-600 text-base md:text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-gray-500">Contributors</p>
              <p className="font-semibold text-sm md:text-base text-gray-800">{approversCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <FaCheckCircle className="text-green-600 text-base md:text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-gray-500">Requests</p>
              <p className="font-semibold text-sm md:text-base text-gray-800">{requestsCount}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-yellow-100 rounded-lg flex-shrink-0">
              <FaClock className="text-yellow-600 text-base md:text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-gray-500">Min. Contrib.</p>
              <p className="font-semibold text-[10px] md:text-sm text-gray-800 truncate">{minimumContribution} wei</p>
            </div>
          </div>
        </div>

        {/* View Campaign Button */}
        <Link href={`/campaigns/${address}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full gradient-btn flex items-center justify-center space-x-2 group py-2.5 md:py-3 text-sm md:text-base"
          >
            <span>View Campaign</span>
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default CampaignCard;