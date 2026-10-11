# Anime Image Board

Next.js application with anime images and GIFs. No API keys are currently required.

## Local development

Use Node.js 22+ (recommended: Node.js 24).

```sh
npm ci
npm run dev
```

Validation: `npm test` and `npm run build`. Run the production build with `npm start`.

## Image providers

Both static generation and `/api/images` use `lib/image-provider.mjs`:

- **nekos.best**: neko, waifu and supported reaction GIFs; 20 images per request.
- **Safebooru**: megumin and shinobu (Oshino Shinobu), filtered to general-rated images; paginated batches of 20.
- **OtakuGIFs**: lick; one GIF per request (the provider has no batch endpoint).

Duplicates are filtered in the gallery. Switching categories cancels pending requests.
Provider failures display a retryable error rather than silently leaving a blank gallery.

NSFW and the SFW categories bully, awoo, glomp, kill and cringe are temporarily unavailable.
Their existing page addresses are preserved, but they are excluded from homepage links and
the dynamic sitemap. They are visibly disabled in the category selector. No unrelated
images are substituted. Category availability is defined in `lib/image-categories.mjs`.

## Deployment

The GitHub repository is `yarsted1677/image-board`; the production branch is `main`.
GitHub deployment history confirms production deployments created by `vercel[bot]`,
including commit `4cf99fc` on 2026-02-03.

The existing deployment workflow is the Vercel GitHub integration: commit and push changes
to `main` to trigger a production build. Before publishing, check the project's Settings →
Git in Vercel to confirm that `main` is still its Production Branch. Use a separate branch/PR
for a Preview deployment and check images, category switching and Load More before merging.
Vercel builds the app with `npm run build`; no image-provider environment variables are needed.

`vercel.json` configures the content type for `/sitemap.xml`. The active sitemap is generated
by `pages/sitemap.xml.js`; `genSitemap.js` is a legacy script and is not part of the build.
