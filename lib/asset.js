// Files in public/ need the base path in front when the site lives under a sub-path (see next.config.mjs).
export const asset = path => `${process.env.NEXT_PUBLIC_BASE_PATH}${path}`;
