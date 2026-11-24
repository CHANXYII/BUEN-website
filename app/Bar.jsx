import Link from 'next/link';
import { logout } from './actions';

// Banner figure (score-page banner and participant cards): cut-out PNG if there is one, else the photo, else the placeholder.
export const Fig = ({ p }) => <span className="fig"><img src={p.cutout || p.photo || `${process.env.BASE_PATH}/participant-placeholder.png`} alt="" /></span>;

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
