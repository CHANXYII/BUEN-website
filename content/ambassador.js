// BUEN Ambassador section. Photos live in public/assets/ambassador/.
import { AIE, CE, ISI, placeholders } from './majors';

// "About Us" playlist: YouTube video IDs. Empty list = "Video coming soon".
export const videos = ['CRQzBIwkU4Q', 'dlwSUSa6UAY'];

export const intro = 'The School of Engineering at Bangkok University prepares world-builders for the engineering profession, balancing theory, practice and real-world projects in fully equipped labs. Our students learn both hardware and software, along with related technologies and keep up with the new data era through Big Data, covering Programmer, IT, Smart System, Robotics & Automation. Our distinctive curricula build skills that set you apart from typical engineering programs, skills you can really use. Through partnerships with international universities, including faculty / student exchanges and joint research projects, students work alongside international researchers and gain a global outlook. With 5 majors to choose your own path, we are an institution that produces engineers ready to meet the technology needs of today and tomorrow';

export const what = {
  title: 'What is BUEN Ambassador ?',
  quote: 'The faces and voices of the School of Engineering: sharing real campus life and inspiring the next generation of engineers.',
  caption: 'BUEN AMBASSADOR',
  // "What we do ?" endless row
  roles: ['Master of Ceremonies', 'Campus Tour Guide', 'Faculty Tray Bearer for the Teacher’s Appreciation Ceremony', 'Faculty Sign Bearer', 'Faculty Flag Bearer', 'Event Representative', 'Live Host'],
};

// Banner people: photo is a cut-out PNG (transparent background, 3:4). No photo = silhouette.
export const advisor = {
  photo: '/assets/ambassador/president/advisor.png',
  badge: 'BUEN AMBASSADOR Advisor',
  name: 'Dr. Tantikorn Pichpibul',
  meta: 'Instructor of Artificial Intelligence Engineering and Data Science Department',
  roles: ['BU Innovative Teaching Awards 2026', 'Micro-Credential Certifications'],
};

// Presidents slideshow, one entry per president. With one entry the arrows and dots hide.
export const presidents = [
  {
    photo: '/assets/ambassador/president/01.png',
    badge: "President of BUEN AMBASSADOR 1' (2025 - 2026)",
    name: 'Chanunya Sutti',
    meta: 'Artificial Intelligence Engineering and Data Science, Year 4',
    roles: ['BUEN AMBASSADOR: The 1st Generation', 'ASEAN Digital GrandPals Thailand', 'Google Student Ambassador Thailand (Batch 1)'],
  },
];

// One entry per generation, newest first (the first one shows by default).
// Members: positions show on the card and the profile page; profileOnly shows on the profile page only.
// cardHideIn: language codes where the card hides its positions (the profile page still shows them).
// photoX (optional): shift the banner photo sideways, as a % of its width; positive moves it right, e.g. '14%'
// pulls a leaning pose on a left-hand banner inward toward the text. Leave it out to centre the photo.
// photoLift (optional): raises the banner photo, both at rest and on hover, as a % of its height, e.g. '12%' for a
// smaller figure whose head sits lower than the others.
// Each member gets a profile link from their first name, e.g. /joannes (keep first names unique).
// Gallery ("Our work"): { src: '/assets/gallery/gen2-1.jpg', alt: 'What is in the photo', caption: 'Event name' }.
// The first photo shows large; {} is a "Photo coming soon" tile.
export const generations = [
  {
    gen: 2,
    members: [
      { photo: '/assets/ambassador/gen2/02_jaypee.png', name: 'Joannes Paulus M.Ople', major: AIE, year: 'Year 3' },
      { photo: '/assets/ambassador/gen2/03_phum.png', name: 'Thanakrit Archawabool', major: AIE, year: 'Year 3' },
      { photo: '/assets/ambassador/gen2/04_ang.png', name: 'Oangkhana Juti', major: AIE, year: 'Year 3',
        profileOnly: ['Google Student Ambassador Thailand (Batch 2)'] },
      { photo: '/assets/ambassador/gen2/05_tarpriew.png', name: 'Naruechaya Yimsatan', major: CE, year: 'Year 3',
        profileOnly: ['Engineering Student Committee (2025)', 'Google Student Ambassador Thailand (Batch 2)'] },
      { photo: '/assets/ambassador/gen2/06_fleur.png', photoLift: '12%', name: 'Surayut Khongchuai', major: ISI, year: 'Year 2',
        profileOnly: ['Google Student Ambassador Thailand (Batch 2)'] },
    ],
    gallery: placeholders(6),
  },
  {
    gen: 1,
    members: [
      { photo: '/assets/ambassador/gen1/01_gyoza.png', photoX: '6%', photoLift: '14%', name: 'Chanunya Sutti', major: AIE, year: 'Year 3',
        profileOnly: ['ASEAN Digital GrandPals Thailand', 'Google Student Ambassador Thailand (Batch 1)'] },
    ],
    gallery: placeholders(3),
  }
];

export const links = [
  { icon: 'instagram', label: '@buen_ambassador', href: 'https://www.instagram.com/buen_ambassador' },
  { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@BUEngineering' },
  { icon: 'email', label: 'Email', href: 'mailto:buen.ambassador1@gmail.com' },
];
