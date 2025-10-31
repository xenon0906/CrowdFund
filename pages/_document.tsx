import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6366F1" />

        {/* Primary Meta Tags */}
        <meta name="description" content="FundChain - A transparent and secure decentralized crowdfunding platform powered by Ethereum blockchain. Create campaigns, contribute funds, and vote on spending decisions." />
        <meta name="keywords" content="crowdfunding, blockchain, ethereum, web3, decentralized finance, DeFi, smart contracts, transparent funding" />
        <meta name="author" content="Siddhanth" />
        <meta name="robots" content="index, follow" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fundchain.vercel.app/" />
        <meta property="og:title" content="FundChain - Decentralized Crowdfunding Platform" />
        <meta property="og:description" content="Create and fund transparent campaigns on blockchain. Democratic voting ensures fair fund distribution." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fundchain.vercel.app/" />
        <meta property="twitter:title" content="FundChain - Blockchain Crowdfunding" />
        <meta property="twitter:description" content="Transparent crowdfunding with smart contracts. No fees, full control." />
        <meta property="twitter:image" content="/og-image.png" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains for faster connections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://eth-sepolia.g.alchemy.com" />
        <link rel="preconnect" href="https://eth-sepolia.g.alchemy.com" />

        {/* Prefetch critical routes for instant navigation */}
        <link rel="prefetch" href="/" as="document" />
        <link rel="prefetch" href="/getting-started" as="document" />
        <link rel="prefetch" href="/how-it-works" as="document" />
        <link rel="prefetch" href="/create" as="document" />

        {/* Resource hints for better performance */}
        <link rel="modulepreload" href="/_next/static/chunks/pages/index.js" />
        <link rel="modulepreload" href="/_next/static/chunks/pages/create.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}