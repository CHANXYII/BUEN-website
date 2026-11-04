// Contact: address, email and a mailto form (no backend). Details: content/site.js.
import { Fragment } from 'react';
import { contact } from '@/content/site';
import { T } from './Lang';
import Reveal from './Reveal';

export default function Contact() {
  return (
    <Reveal as="section" className="contact" id="contact">
      <div className="wrap two">
        <div>
          <h2><T>Contact</T></h2>
          <p>{contact.address.map((line, i) => <Fragment key={line}>{i > 0 && <br />}<span><T>{line}</T></span></Fragment>)}</p>
          <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        </div>
        <form action={`mailto:${contact.email}`} method="post" encType="text/plain">
          <label><span><T>Name</T></span> <input name="name" required /></label>
          <label><span><T>Email</T></span> <input name="email" type="email" required /></label>
          <label><span><T>Message</T></span> <textarea name="message" rows={4} required></textarea></label>
          <button className="btn primary"><T>Send</T></button>
        </form>
      </div>
    </Reveal>
  );
}
