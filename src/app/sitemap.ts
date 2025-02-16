import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://acme.com", // đường link website triên khai thì cho vào / trang nào nhiều người dùng vào thì thêm vào
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1, // độ ưu tiên
    },
    {
      url: "https://acme.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://acme.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
