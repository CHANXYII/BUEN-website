// Ambassador profile pages: one per member in content/ambassador.js, at /<first name>, e.g. /joannes.
import { generations } from '@/content/ambassador';

export const slugOf = name => name.trim().split(/\s+/)[0].toLowerCase();

// slug -> member, plus their generation number and its "Our work" gallery
export const profiles = Object.fromEntries(generations.flatMap(g =>
  g.members.map(m => [slugOf(m.name), { ...m, gen: g.gen, gallery: g.gallery }])));

const ordinal = n => n + (['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] || 'th');
export const generationRole = gen => `BUEN Ambassador: The ${ordinal(gen)} Generation`;
