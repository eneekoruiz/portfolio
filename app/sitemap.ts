import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = "https://eneko-ruiz.vercel.app";
  const lastModified = new Date();

  return [
    {
      url: domain,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${domain}/lab`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${domain}/curriculum`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...[
      "ana-peluquera",
      "recordatorios",
      "passwordmanager",
      "regla",
      "who-are-ya-backend",
      "rides24ofiziala",
      "spotshare-parking",
      "pke-web",
    ].map((id) => ({
      url: `${domain}/work/${id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
