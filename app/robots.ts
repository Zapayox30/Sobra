import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sobra.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/incomes', '/expenses', '/commitments', '/profile', '/onboarding'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard', '/incomes', '/expenses', '/commitments', '/profile', '/onboarding'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

