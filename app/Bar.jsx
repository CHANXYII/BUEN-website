import Link from 'next/link';
import { logout } from './actions';

export const Pic = ({ p }) => p.photo ? <img src={p.photo} alt="" /> : <span className="av" aria-hidden="true">{p.id.replace(/\D/g, '')}</span>;

export default function Bar({ me }) {
  return (
    <header className="lb-bar">
      <Link className="brand" href="/" aria-label="School of Engineering, Bangkok University">
        <img src={`${process.env.BASE_PATH}/assets/BUEN-Logo-header.png`} alt="" width="380" height="99" />
      </Link>
      {me && <form action={logout} className="me"><span>Judge: <strong>{me}</strong></span><button className="btn">Log out</button></form>}
    </header>
  );
}
