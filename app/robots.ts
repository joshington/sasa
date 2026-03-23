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
```

---

**Create an OG image for social sharing:**

Create a `1200 x 630px` image and save it as `public/og-image.png`. It should have:
- Pesasa logo
- Tagline: "Send money. Control how it's spent."
- Green brand background
- Uganda flag or African context

This image appears whenever someone shares your link on WhatsApp, Twitter, LinkedIn or Facebook.

---

## 2. Keyword Strategy — What to Target

These are the exact phrases your target customers are already searching:

**High priority — people actively looking for your solution:**

| Keyword | Monthly searches | Difficulty |
|---|---|---|
| "school fees management Uganda" | Low | Low |
| "send money Uganda family control" | Low | Low |
| "black tax solution" | Low | Low |
| "controlled spending app Africa" | Low | Very low |
| "student allowance app Uganda" | Low | Very low |
| "fintech Uganda" | Medium | Medium |
| "diaspora remittance Uganda" | Low | Low |
| "employee allowance management Africa" | Low | Low |

Low search volume in Uganda is actually good right now — you can rank page 1 very quickly with minimal effort because almost nobody else is targeting these keywords.

**Include these keywords naturally in:**
- Your homepage headings and body text
- Page titles and meta descriptions
- Alt text on images
- Medium articles and blog posts
- Footer text

---

## 3. Content SEO — The Biggest Long-Term Win

**Create a `/blog` section on your website**

Every article you write on Medium should also live on `pesasa.xyz/blog`. Medium is good for distribution but Google gives more SEO credit to content on your own domain.
pesasa.xyz/blog/black-tax-infrastructure-problem
pesasa.xyz/blog/cash-in-schools-problem-uganda
pesasa.xyz/blog/diaspora-remittance-accountability
pesasa.xyz/blog/how-pesasa-works


```

