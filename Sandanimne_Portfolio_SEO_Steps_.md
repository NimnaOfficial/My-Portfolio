# K.G.L. Sandanimne — Portfolio SEO Setup Guide

**Steps 1, 2 and 3: SEO Metadata • Personal Identity Structured Data • XML Sitemap**  
**Prepared:** October 28, 2026  
**Repository:** https://github.com/NimnaOfficial/My-Portfolio  
**Portfolio:** https://nimnaofficial.github.io/My-Portfolio/  
**Hosting:** GitHub Pages (project site)

---

## Goal: make your portfolio discoverable for your name

You want your personal website to have a better chance of appearing in search engines when people search for:

- `KGL Sandanimne`
- `K.G.L. Sandanimne`
- `Sandanimne KGL`
- `Sandanimne`
- `NimnaOfficial`

These three steps make the website's identity clearer and help search engines understand and discover the page. **They do not guarantee a Google ranking, immediate indexing or the exact search-result text.** After implementing them, a separate follow-up task will be to verify your property in Google Search Console and submit your sitemap.

### What was checked in your repository

The `main` branch currently contains `index.html`, `style.css`, `script.js`, `README.md`, the résumé PDF, and supporting files. The current `<head>` already has a `<title>` and `<meta name="description">` but is missing a canonical link and the identity JSON-LD described below. There is no `sitemap.xml` in the repository root at the time this guide was prepared.

### What you will change

| Step | File | Action | Expected result |
|---|---|---|---|
| 1 | `index.html` | Replace existing title/description; add canonical and social metadata; adjust a visible introductory sentence | More accurate name and portfolio information |
| 2 | `index.html` | Add one JSON-LD script inside `<head>` | Structured description of your identity and public profiles |
| 3 | `sitemap.xml` | Create a new file in the repository root | A discoverable XML list of your public portfolio page |

**Important:** All three steps can be completed through the GitHub website without installing software. Do not replace your entire `index.html`; the snippets below only modify specific parts.

---

# STEP 0 — Prepare safely

1. Open your repository: https://github.com/NimnaOfficial/My-Portfolio
2. Confirm that the branch selector says **`main`**.
3. Open `index.html` and note its current content.
4. Optional but recommended: use the GitHub **Download ZIP** menu or create a separate backup branch before editing.
5. Keep a second browser tab open with your live portfolio: https://nimnaofficial.github.io/My-Portfolio/

**Editing using GitHub.com:** Open the file → click the pencil **Edit this file** icon → make your change → click **Commit changes** → enter a descriptive commit message → commit to `main` (if you have permission). GitHub Pages deployment may take a little while after each commit. You can do all steps in a single commit or separately; this guide recommends separate commits so mistakes are easier to locate.

---

# STEP 1 — Improve the SEO metadata in `index.html`

## 1.1 Find the existing metadata

Open `index.html` and locate the first lines. They currently resemble:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

    <title>K.G.L Sandanimne | Systems & Distributed Software Engineer</title>
    <meta name="description" content="Portfolio of K.G.L Sandanimne (Nimna) — Software Engineering Student specializing in Distributed Microservices, C++20 Systems Programming, Edge WebAssembly, and High-Performance UI/UX.">
```

There should be **only one** `<title>` and **only one** `<meta name="description">` in the final page. Replace the existing ones; do not paste a second copy elsewhere.

## 1.2 Replace the existing `<title>` and description

Replace **just those two tags** with:

```html
<title>K.G.L. Sandanimne | Software Engineering Portfolio</title>
<meta name="description" content="Explore the portfolio of K.G.L. Sandanimne (KGL Sandanimne), a Software Engineering student at NIBM Sri Lanka. Discover projects in Java, C++, distributed systems, web development and cloud computing.">
```

**Why these choices?**

- The full name appears first, making the page easy to associate with you.
- “Software Engineering Portfolio” accurately describes the site.
- The description communicates what a visitor will find without repeating search terms unnaturally.
- Google may generate its own search title or description; that is normal.

## 1.3 Insert a canonical URL and crawl directive

Directly below the description, add:

```html
<link rel="canonical" href="https://nimnaofficial.github.io/My-Portfolio/">
<meta name="robots" content="index, follow">
```

**Why?**

- The canonical tag identifies the preferred URL for this page. Keep the `My-Portfolio` capitalization and trailing `/` exactly as shown.
- The robots directive permits indexing and link following. It is optional because search engines generally allow both by default; it does **not** override a blocking `robots.txt` rule or automatically force indexing.

## 1.4 Add social sharing metadata

Below those tags, add:

```html
<!-- Social sharing / Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="K.G.L. Sandanimne | Software Engineering Portfolio">
<meta property="og:description" content="Explore the software engineering projects and developer portfolio of K.G.L. Sandanimne, an NIBM student building full-stack, C++, cloud and distributed systems projects.">
<meta property="og:url" content="https://nimnaofficial.github.io/My-Portfolio/">
<meta property="og:site_name" content="K.G.L. Sandanimne Portfolio">
```

These tags primarily help platforms generate a link preview. They are not a direct guarantee of higher search rankings.

**Optional later:** Add `og:image` when you have a real, publicly accessible, high-quality preview image of your portfolio. Do not point it to the tiny `image.png` favicon unless it is actually suitable for social previews.

## 1.5 What the top of the `<head>` should look like

The final top section of your real file should resemble this. **Keep the remainder of your existing `<head>` (favicon, Google Fonts, CSS, and mobile web-app tags) unchanged.**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

    <!-- Main SEO -->
    <title>K.G.L. Sandanimne | Software Engineering Portfolio</title>
    <meta name="description" content="Explore the portfolio of K.G.L. Sandanimne (KGL Sandanimne), a Software Engineering student at NIBM Sri Lanka. Discover projects in Java, C++, distributed systems, web development and cloud computing.">
    <link rel="canonical" href="https://nimnaofficial.github.io/My-Portfolio/">
    <meta name="robots" content="index, follow">

    <!-- Social sharing / Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="K.G.L. Sandanimne | Software Engineering Portfolio">
    <meta property="og:description" content="Explore the software engineering projects and developer portfolio of K.G.L. Sandanimne, an NIBM student building full-stack, C++, cloud and distributed systems projects.">
    <meta property="og:url" content="https://nimnaofficial.github.io/My-Portfolio/">
    <meta property="og:site_name" content="K.G.L. Sandanimne Portfolio">

    <!-- Keep your existing favicon, fonts, stylesheet and other head tags here. -->
</head>
```

**Do not literally replace your complete head section with this abbreviated example:** it omits your original favicon, fonts, stylesheet and web-app tags only to keep the example readable.

## 1.6 Make your complete name visible on the page

Search engines also read the content visitors can actually see, not just the hidden metadata.

Your existing hero includes:

```html
<h1 class="huge-text" id="hero-text">HI, I'M <br> SANDANIMNE</h1>
<p class="subtitle reveal-up delay-1">Software Engineering student specializing in Distributed Microservices, C++20 Systems Programming, Edge WebAssembly, and Intelligent AI Architectures.</p>
```

**Keep your existing styled heading** to preserve its visual appearance. Replace only its subtitle `<p>` with:

```html
<p class="subtitle reveal-up delay-1">I'm K.G.L. Sandanimne (KGL Sandanimne), a Software Engineering student at NIBM Sri Lanka, exploring full-stack development, C++ systems programming, distributed architecture and cloud computing.</p>
```

This makes the name recognizable in visible page text without stuffing every name variation into the headline. If the subtitle becomes too long on mobile, adjust its responsive styling separately; avoid breaking the hero layout just for SEO.

## 1.7 Commit and verify Step 1

1. Click **Commit changes**.
2. Use commit message: `seo: improve portfolio metadata and visible name`
3. Visit https://nimnaofficial.github.io/My-Portfolio/ after deployment.
4. Right-click → **View page source** (or use `Ctrl+U` in many desktop browsers).
5. Find (`Ctrl+F`) the following:
   - `K.G.L. Sandanimne | Software Engineering Portfolio`
   - `rel="canonical"`
   - `property="og:title"`
   - `KGL Sandanimne`
6. Make sure the site still looks right and the favicon, font and styles load.

**Step 1 is complete when:** the deployed source includes the new tags, your full name appears visibly on the page, and your portfolio still works normally.

---

# STEP 2 — Add Personal Identity Structured Data (JSON-LD)

## 2.1 What this does

Structured data is machine-readable information about your website. Here we use Schema.org **`ProfilePage`** with a **`Person`** as its main subject, because this is your personal developer portfolio.

It describes:

- Your professional display name: **K.G.L. Sandanimne**
- Name/handle variations people may recognize
- Your student/developer role
- The exact website URL
- Links to your public GitHub and LinkedIn profiles
- Your NIBM affiliation

The `sameAs` property communicates that your other public profiles refer to the same person. **It does not merge search results or guarantee a special Google panel.**

## 2.2 Open `index.html` again

1. Open https://github.com/NimnaOfficial/My-Portfolio/blob/main/index.html
2. Click **Edit**.
3. Find `</head>` near the end of the HTML head.
4. Paste the entire script below **immediately before `</head>`**.
5. Leave the previous SEO metadata and all other existing tags in place.

## 2.3 Copy-paste JSON-LD for your exact profile

```html
<!-- Schema.org identity information for the personal portfolio -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://nimnaofficial.github.io/My-Portfolio/#profile",
  "url": "https://nimnaofficial.github.io/My-Portfolio/",
  "name": "K.G.L. Sandanimne | Software Engineering Portfolio",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://nimnaofficial.github.io/My-Portfolio/#person",
    "name": "K.G.L. Sandanimne",
    "alternateName": [
      "KGL Sandanimne",
      "Sandanimne KGL",
      "Nimna",
      "NimnaOfficial"
    ],
    "url": "https://nimnaofficial.github.io/My-Portfolio/",
    "description": "Software Engineering student at NIBM Sri Lanka exploring full-stack development, C++, distributed systems, databases and cloud computing.",
    "sameAs": [
      "https://github.com/NimnaOfficial",
      "https://www.linkedin.com/in/sandanimne-k-g-l-a276aa34a"
    ],
    "affiliation": {
      "@type": "CollegeOrUniversity",
      "name": "National Institute of Business Management"
    }
  }
}
</script>
```

**Important data-quality rules:**

- Ensure both public profile URLs are correct and belong to you.
- Only list alternative names or handles that you actually use or are genuinely recognized by.
- Do not invent qualifications, awards, employers, employment titles or educational degrees.
- You do not need to insert an image property unless you have a real, public, crawlable profile photo.
- Leave out `givenName` and `familyName` here because your initials and name parts should not be guessed.
- Keep JSON syntax exact: double quotes around keys/values, commas where shown, and no trailing comma after the final property.

## 2.4 Understand where to paste it

The correct structure is:

```html
<html lang="en">
<head>
    <!-- charset, viewport, title, description, canonical, Open Graph -->
    <!-- your existing favicon, fonts and stylesheet -->

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": "K.G.L. Sandanimne"
      }
    }
    </script>
</head>
<body>
    <!-- Your existing portfolio sections, animations, and components -->
</body>
</html>
```

The short JSON in this **structure-only illustration** is not the full recommended snippet. Use the complete copy-paste snippet in **2.3** above.

## 2.5 Commit and verify Step 2

1. Commit with message: `seo: add structured personal identity data`
2. Open the live portfolio after GitHub Pages deploys.
3. Open **View page source** and search for `application/ld+json`.
4. Confirm the structured data appears only once and the GitHub/LinkedIn URLs are correct.
5. Validate with Google's **Rich Results Test:** https://search.google.com/test/rich-results
6. Optionally validate the JSON-LD vocabulary at https://validator.schema.org/

The Rich Results Test may show no special eligible enhancement for a personal portfolio. A lack of a rich-result preview is **not by itself proof that valid Schema.org data is broken**. Correct any *syntax or property errors* that the validators actually report.

**Step 2 is complete when:** your publicly deployed source contains one valid JSON-LD script with your accurate identity and public profiles.

---

# STEP 3 — Create an XML sitemap

## 3.1 What a sitemap does

An XML sitemap lists your preferred public page URLs and can help search engines discover them. Your portfolio is a **single-page website**, so you only need to list its homepage once.

**Your exact sitemap location will be:**

`https://nimnaofficial.github.io/My-Portfolio/sitemap.xml`

The filename must be exactly **`sitemap.xml`** — not `sitemap.xml.txt`, `sitemap.md`, or `Sitemap.xml`.

## 3.2 Create the file using GitHub.com

1. Open https://github.com/NimnaOfficial/My-Portfolio
2. Ensure you're on the **`main`** branch.
3. Click **Add file → Create new file**.
4. In the filename field, type: `sitemap.xml`
5. Paste the XML shown below exactly.

## 3.3 Copy-paste sitemap content

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://nimnaofficial.github.io/My-Portfolio/</loc>
    </url>
</urlset>
```

**Notes:**

- `loc` is the exact portfolio homepage URL, not the GitHub repository URL.
- Use the same URL as the canonical link in Step 1.
- Keep the `https://` prefix, the path capitalization, and the trailing `/`.
- Do not include links to GitHub, LinkedIn, PDFs or other domains as sitemap pages unless they actually belong to your portfolio and your intended site scope.
- You do not need `priority` or `changefreq`. Google ignores them for sitemap crawling.
- An accurate `<lastmod>` date is optional; leaving it out is better than inventing or manually forgetting to update it.

## 3.4 Commit the new sitemap

1. Click **Commit changes**.
2. Use commit message: `seo: add XML sitemap for portfolio`
3. Confirm you now see `sitemap.xml` at the top level of the repository, alongside `index.html`.

Your repository root should now resemble:

```text
My-Portfolio/
├── .github/
├── README.md
├── LICENSE
├── index.html
├── script.js
├── style.css
├── image.png
├── K_G_L_Sandanimne_FlowCV_Resume_2026-10-28.pdf
└── sitemap.xml                   <-- NEW
```

## 3.5 Verify Step 3 in the browser

Open:

https://nimnaofficial.github.io/My-Portfolio/sitemap.xml

Check all three:

1. The page loads successfully; it must not show **404 Not Found**.
2. It displays or makes available the XML content with the `<urlset>` and `<loc>` elements.
3. The address inside `<loc>` is `https://nimnaofficial.github.io/My-Portfolio/`.

It's normal if the browser says the XML has no style information. It is a machine-readable file, not a designed web page.

**Step 3 is complete when:** the new sitemap is accessible at the live URL and contains your one canonical portfolio page.

### A GitHub Pages / `robots.txt` detail

Because this is a *project site* hosted under `/My-Portfolio/`, a `robots.txt` placed inside this repository **is not** the hostname-level `robots.txt`. Search engines normally look at:

`https://nimnaofficial.github.io/robots.txt`

Do not create a project-folder `robots.txt` and assume it controls crawling for the whole hostname. No robots file is needed for Steps 1–3. You can submit this sitemap directly in Google Search Console later.

---

# Optional local Git workflow (instead of editing on GitHub.com)

If you have a local clone of the project and are comfortable with Git:

```bash
# Run in your existing My-Portfolio local repository directory:
git status
git switch main
git pull --ff-only origin main

# Edit index.html and create sitemap.xml, then:
git diff --check
git add index.html sitemap.xml
git commit -m "seo: improve portfolio discovery and identity markup"
git push origin main
```

**Safety checks:**

- Inspect `git status` before pulling. If you have uncommitted local changes, deal with them safely first rather than overwriting work.
- `git pull --ff-only` refuses to perform an automatic merge if histories diverged.
- Only add `index.html` and `sitemap.xml` for this task; do not accidentally commit secrets or temporary files.
- The commands above are optional. The GitHub website method is sufficient.

---

# Final verification checklist

Use this checklist once Steps 1–3 are finished:

- [ ] `index.html` contains exactly **one** `<title>` tag.
- [ ] `index.html` contains exactly **one** meta description.
- [ ] The title includes **K.G.L. Sandanimne** and describes the portfolio.
- [ ] The description is readable and truthful, not a list of repeated keywords.
- [ ] The canonical URL is **https://nimnaofficial.github.io/My-Portfolio/**.
- [ ] Open Graph title, description, URL and site name are present.
- [ ] The visible hero introduction includes **K.G.L. Sandanimne (KGL Sandanimne)** naturally.
- [ ] Exactly one complete Schema.org `ProfilePage` JSON-LD script is present.
- [ ] JSON-LD links to your correct GitHub and LinkedIn profiles.
- [ ] JSON-LD passes a JSON/Schema.org syntax check.
- [ ] `sitemap.xml` exists beside `index.html` on branch `main`.
- [ ] `https://nimnaofficial.github.io/My-Portfolio/sitemap.xml` opens successfully.
- [ ] Your website still works on desktop and mobile.

## Troubleshooting

| Issue | What to check |
|---|---|
| Site still shows old metadata | Wait for Pages deployment, refresh, use View Source, and confirm you committed to the branch Pages deploys from. |
| Two titles or descriptions | Remove the duplicate; keep one authoritative version of each tag. |
| JSON-LD validation error | Check double quotes, commas, curly brackets and whether the script was pasted completely. |
| GitHub shows XML but website returns 404 | Confirm Pages deployment finished, file is at repository root, and the filename/case are exact. |
| Site CSS or fonts stop working | You likely removed an existing `<link>` tag or malformed the `<head>`; restore the original stylesheet and font tags. |
| Website not visible in Google immediately | Normal: these steps improve clarity/discovery, but indexing and ranking depend on crawling and other factors. |

---

# After these three steps (not part of this guide)

The next stage is **Google Search Console**: add `https://nimnaofficial.github.io/My-Portfolio/` as a **URL-prefix property**, verify ownership, inspect the homepage, request indexing if available, and submit the live sitemap. You can separately configure **Bing Webmaster Tools**. These tools help monitor discovery and indexing, but neither can guarantee rankings.

## Official documentation and validation tools

- Google — Title link guidance: https://developers.google.com/search/docs/appearance/title-link
- Google — ProfilePage structured data: https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Google — Build and submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google — Rich Results Test: https://search.google.com/test/rich-results
- Schema.org validator: https://validator.schema.org/

---

**Target outcome:** Your live portfolio clearly identifies **K.G.L. Sandanimne**, explicitly connects to your public developer profiles, and publishes a crawlable sitemap. Then search engine verification/indexing is the next step.
