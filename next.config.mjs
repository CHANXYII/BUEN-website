// Static export to out/ for GitHub Pages. Project page lives under /BUEN-website: build with BASE_PATH=/BUEN-website (empty for a custom domain).
export default {
  output: 'export',
  basePath: process.env.BASE_PATH || '',
  env: { BASE_PATH: process.env.BASE_PATH || '' },
};
