import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // cho phép tất cả con bot đào được dữ liệu
      allow: "/", // cho phép tất cả đường link
      disallow: "/private/", // đường link không đào
    },
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}
