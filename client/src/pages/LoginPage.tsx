import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const roleAccounts = [
  {
    label: 'Guest',
    email: 'guest@example.com',
    password: 'guest123',
  },
  {
    label: 'User',
    email: 'user@example.com',
    password: 'user123',
  },
  {
    label: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState(roleAccounts[1].email);
  const [password, setPassword] = useState(roleAccounts[1].password);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginUser(email, password);
      navigate('/');
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : 'Login failed',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section>
        <div className="section-heading">
          <p className="eyebrow">Account</p>
          <h1>Log in</h1>
        </div>

        <form className="login-form" onSubmit={submitLogin}>
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="form-message error-message">{error}</p>}

          <button
            className="primary-button wide-button"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in...' : 'Log in'}
          </button>
        </form>
      </section>

      <aside className="role-panel">
        <h2>Test roles</h2>
        {roleAccounts.map((account) => (
          <button
            className="role-choice"
            key={account.email}
            onClick={() => {
              setEmail(account.email);
              setPassword(account.password);
            }}
            type="button"
          >
            <strong>{account.label}</strong>
            <span>{account.email}</span>
          </button>
        ))}
      </aside>
    </main>
  );
}
