import { redirect } from 'next/navigation';
import { judge } from '../lib';
import { login } from '../actions';
import Bar from '../Bar';

export default async function Login({ searchParams }) {
  if (await judge()) redirect('/');
  const { error } = await searchParams;
  return (<>
    <Bar />
    <main className="wrap">
      <form action={login} className="sheet login">
        <h1>Judge login</h1>
        {error && <p className="err" role="alert">Wrong name or password.</p>}
        <label><span>Name</span><input name="name" autoComplete="username" required /></label>
        <label><span>Password</span><input type="password" name="password" autoComplete="current-password" required /></label>
        <button className="btn primary">Log in</button>
      </form>
    </main>
  </>);
}
