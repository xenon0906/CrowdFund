// Input validation and sanitization utilities

export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num < 1000000; // Max 1M ETH
};

export const validateMinimumContribution = (amount: string): boolean => {
  const num = parseInt(amount);
  return !isNaN(num) && num > 0 && num < 10**18; // Max 1 ETH in wei
};

export const sanitizeInput = (input: string): string => {
  // Remove any HTML/script tags
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
    .slice(0, 1000); // Max 1000 characters
};

export const validateCampaignTitle = (title: string): boolean => {
  const sanitized = sanitizeInput(title);
  return sanitized.length >= 3 && sanitized.length <= 100;
};

export const validateCampaignDescription = (description: string): boolean => {
  const sanitized = sanitizeInput(description);
  return sanitized.length >= 10 && sanitized.length <= 500;
};

export const isValidNetwork = (chainId: number): boolean => {
  return chainId === 11155111; // Sepolia testnet only
};

export const formatAddress = (address: string): string => {
  if (!validateAddress(address)) return 'Invalid Address';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const validateTransactionHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

// Prevent XSS attacks
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};