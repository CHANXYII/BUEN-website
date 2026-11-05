// Runs as a Node server (`npm run build && npm start`): judge login and score saving need one, so no static export.
export default {
  basePath: process.env.BASE_PATH || '',
  env: { BASE_PATH: process.env.BASE_PATH || '' },
};
