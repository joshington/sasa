// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/parent/dashboard",
        "/merchant/dashboard",
        "/api/",
      ],
    },
    sitemap: "https://pesasa.xyz/sitemap.xml",
  };
}


