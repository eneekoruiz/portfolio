import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = 'https://eneko-ruiz.vercel.app';
  const lastModified = new Date();

  return [
    {
      url: domain,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${domain}/lab`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${domain}/curriculum`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
