// Engineering Student Committee (STAFFBUEN). Photos live in public/assets/staffbuen/<year>/.
import { AIE, CE, EE, placeholders } from './majors';

export const what = {
  title: 'What is STAFFBUEN ?',
  quote: 'The student voice of the School: organising activities, supporting classmates and connecting students with the faculty.',
  caption: 'Engineering Student Committee',
  roles: ['BU Diamond Day: Student Orientation', 'First Meet', 'BU OPEN HOUSE', 'Engineering Un-Tie & Gear', 'Engineering Legacy Run', 'BU Freshy Game', 'Cheer Day', 'BU Diamond Game', 'Engineering Farewell'],
};

// One entry per academic year, newest first. The year tabs appear by themselves once there are two.
// Each year has groups (the tabs above the members). A group can have a gallery (first photo shows large,
// {} = "Photo coming soon") and its own social links. No photo = silhouette.
export const years = [
  {
    year: 2026,
    president: {
      badge: 'President of Engineering Student Committee (2026)',
      name: 'Siriwan Ruamthong',
      meta: 'Computer and Robotics Engineering, Year 2',
      roles: ['Engineering Cheerleader: The 17th Generation'],
    },
    groups: [
      {
        id: 'committee',
        label: 'Committee',
        members: [
          { photo: '/assets/staffbuen/2026/committee/02_staff.png', name: 'Nawat Tanunchai', positions: ['Vice President'], major: EE, year: 'Year 2' },
          { photo: '/assets/staffbuen/2026/committee/03_staff.png', name: 'Jiraphat Phanphuet', positions: ['Public Relations Administrator'], major: CE, year: 'Year 2' },
          { photo: '/assets/staffbuen/2026/committee/04_staff.png', name: 'Monchanok Thepmanothaisakul', positions: ['Student Welfare'], major: CE, year: 'Year 2' },
        ],
        gallery: placeholders(6),
        links: [
          { icon: 'instagram', label: '@staffbuen', href: 'https://www.instagram.com/staffbuen' },
          { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100051820306023' },
          { icon: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@staffbuen09' },
        ],
      },
      {
        id: 'cheer',
        label: 'Cheerleader & Katakorn',
        members: [
          { photo: '/assets/staffbuen/2026/cheerleader/01_kongphop.jpg', name: 'Jiraphat Phanphuet', major: CE, year: 'Year 2' },
          { photo: '/assets/staffbuen/2026/cheerleader/02_muay.jpg', name: 'Monchanok Thepmanothaisakul', major: CE, year: 'Year 2' },
          { photo: '/assets/staffbuen/2026/cheerleader/03_aom.jpg', name: 'Voranun Savirod', major: EE, year: 'Year 1' },
          { photo: '/assets/staffbuen/2026/cheerleader/04_praewa.jpg', name: 'Praewa Manmuenpom', major: EE, year: 'Year 1' },
          { photo: '/assets/staffbuen/2026/cheerleader/05_ice.jpg', name: 'Nattaporn Buathongkham', major: EE, year: 'Year 1' },
          { photo: '/assets/staffbuen/2026/cheerleader/06_noey.jpg', name: 'Penpisur Vashiraareerat', major: AIE, year: 'Year 4' },
          { photo: '/assets/staffbuen/2026/cheerleader/07_pim.jpg', name: 'Suchanya Yothayan', major: CE, year: 'Year 4' },
          { photo: '/assets/staffbuen/2026/cheerleader/08_four.jpg', name: 'Papichaya Kingkohyaw', major: AIE, year: 'Year 1' },
          { photo: '/assets/staffbuen/2026/cheerleader/09_inging.jpg', name: 'Wenying Pua', major: AIE, year: 'Year 2' },
          { photo: '/assets/staffbuen/2026/cheerleader/10_pond.jpg', name: 'Suphinyo Ratsamekeaw', major: CE, year: 'Year 2' },
          { photo: '/assets/staffbuen/2026/cheerleader/11_sol.jpg', name: 'Chalintakorn Phusinkorn', major: EE, year: 'Year 3' },
        ],
        links: [
          { icon: 'instagram', label: '@encl.official', href: 'https://www.instagram.com/encl.official/' },
        ],
      },
    ],
  },
];
