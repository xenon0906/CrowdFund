import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fundchain.vercel.app';

  const robots = `# FundChain Robots Configuration
# ${baseUrl}

User-agent: *
Allow: /
Allow: /getting-started
Allow: /how-it-works
Allow: /create
Disallow: /api/
Disallow: /_next/
Disallow: /.next/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay to prevent overload
Crawl-delay: 1

# Allow major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  res.status(200).send(robots);
}