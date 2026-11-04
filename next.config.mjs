// Static export: `npm run build` writes plain HTML/CSS/JS to out/, served by nginx (Docker) or GitHub Pages.
// BASE_PATH: set when the site lives under a sub-path, e.g. /BUEN-website on <account>.github.io (CI sets it).
const basePath = process.env.BASE_PATH || '';

export default {
  output: 'export',
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
};
