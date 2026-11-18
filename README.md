# Portfolio

Next.js (App Router) + TypeScript + CSS Modules, built from the Figma file "Portfolio · Desktop" (1906 × 2617).

```bash
npm install
npm run dev     # http://localhost:3000
```

## Where to edit

| What | File |
| --- | --- |
| All text, links, work items, projects, contact | `src/data/content.ts` |
| Contribution grid (53 weeks × 7 days, levels 0–4) | `src/data/contributions.json` |
| Colors / shared tokens | `src/app/globals.css` |
| Page layout and section spacing | `src/app/page.tsx`, `src/app/page.module.css` |
| Sections | `src/components/*` (each has its own `.module.css`) |

Links the design didn't specify are `"#"` and marked `TODO` in `content.ts`.

## Assets

Taken directly from the Figma file:
- `public/icons/*.svg`: all pixel-art icons, apple and link-out icons
- `public/images/lofi-cover.jpg`: original cover image
- `public/images/logo-*.png`: work logos (3× export)

Temporary stand-ins (the Figma API rate limit was hit before these could be downloaded). Re-export them from Figma and overwrite these files:
- `public/images/profile.jpg`: the original is 573×648, but only the top 510px came through. Export the "Profile photo" image fill.
- `public/images/lantern.png`: cropped from a low-res render. Export layer "image 4".
- `public/images/garden.png`: the grass and flowers strip, cropped from a low-res render. Export group "Group 10" as PNG at 2× with a transparent background, cropped to the frame's bottom edge (y 2373 → 2617).
