// Small building blocks shared by the sections.
import { Fragment } from 'react';
import { asset } from '@/lib/asset';
import { key } from '@/i18n';
import { T, useLang } from './Lang';
import Reveal from './Reveal';
import RolesLoop from './RolesLoop';

const ICONS = {
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></>,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9 5 3-5 3z" /></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  facebook: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8H14a2.5 2.5 0 0 0-2.5 2.5V21M9 13.5h5.5" /></>,
  tiktok: <><circle cx="12" cy="12" r="9" /><path d="M13 7v6.5a2 2 0 1 1-2-2M13 7c.3 1.6 1.4 2.6 3 2.7" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
};
export const Icon = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>;

// Portrait: the photo, or a silhouette until there is one. Extra children sit on top (e.g. "Show more").
export const Avatar = ({ photo, name, children }) => (
  <div className="avatar">
    {photo ? <img src={asset(photo)} alt={name} loading="lazy" /> : <Icon name="person" />}
    {children}
  </div>
);

// Member card. Extra props (onClick, ...) go on the <article>.
// p.cardHideIn: language codes where the card hides positions.
export const Person = ({ person: p, more, ...rest }) => {
  const { lang } = useLang();
  return (
    <article className="person" tabIndex={0} {...rest}>
      <Avatar photo={p.photo} name={p.name}>{more && <span className="more"><T>Show more</T></span>}</Avatar>
      <h4><T>{p.name}</T></h4>
      {!p.cardHideIn?.includes(lang.code) && p.positions?.map(x => <p className="position" key={x}><T>{x}</T></p>)}
      <p><T>{p.major}</T></p>
      <small><T>{p.year}</T></small>
    </article>
  );
};

// Banner text scrolling behind the photo.
export const Marquee = ({ word, n = 3 }) => {
  const text = `${word} ✦ `.repeat(n);
  return <div className="banner-marquee" aria-hidden="true"><span>{text}</span><span>{text}</span></div>;
};

// Banner slide: photo, badge, name, meta line and a list of roles.
export const Slide = ({ person: p, ...rest }) => (
  <article className="slide" {...rest}>
    <Avatar photo={p.photo} name={p.name} />
    <div>
      {p.badge && <span className="badge"><T>{p.badge}</T></span>}
      <h4><T>{p.name}</T></h4>
      <p className="meta"><T>{key(p.meta)}</T></p>
      <ul className="quote roles">{p.roles.map(r => <li key={r}><T>{r}</T></li>)}</ul>
    </div>
  </article>
);

// Gallery tiles: a photo with an optional caption, or a "Photo coming soon" placeholder ({}).
export const Shots = ({ items }) => items.map((s, i) => (
  <figure className="shot" key={i}>
    {s.src && <img src={asset(s.src)} alt={s.alt || ''} loading="lazy" />}
    {(s.caption || !s.src) && <figcaption><T>{s.caption || 'Photo coming soon'}</T></figcaption>}
  </figure>
));

// Tab buttons. items: [{ id, label }].
export const Tabs = ({ items, value, onChange, className = 'tabs' }) => (
  <div className={className} role="tablist">
    {items.map(it => (
      <button key={it.id} role="tab" data-gen={it.id} className={it.id === value ? 'on' : ''} aria-selected={it.id === value} onClick={() => onChange(it.id)}>
        <T>{it.label}</T>
      </button>
    ))}
  </div>
);

// Social / contact buttons. Web links open in a new tab; mailto links do not. spaced: a space between buttons.
export const Links = ({ links, spaced }) => links.map((l, i) => {
  const web = !l.href.startsWith('mailto:');
  return (
    <Fragment key={l.href}>{spaced && i > 0 && ' '}<a className={`btn primary${web ? ' ig' : ''}`} href={l.href} {...(web && { target: '_blank', rel: 'noopener' })}>
      <Icon name={l.icon} /><span><T>{l.label}</T></span>
    </a></Fragment>
  );
});

// "What is ... ?" block: heading, quote, then the endless row of roles.
export const WhatIs = ({ id, title, quote, caption, roles }) => (
  <Reveal className="block" id={id}>
    <div className="what-head"><h2><T>{title}</T></h2></div>
    <figure className="what-quote">
      <blockquote><p><T>{quote}</T></p></blockquote>
      <figcaption><T>{caption}</T></figcaption>
    </figure>
    <div className="roles-show">
      <h3 className="group"><T>What we do ?</T></h3>
      <RolesLoop roles={roles} />
    </div>
  </Reveal>
);
