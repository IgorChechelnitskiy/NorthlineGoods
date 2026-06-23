import { FormEvent, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function SettingsPage() {
  const { isAuthenticated, updateProfile, user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      password: '',
    });
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  async function submitSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        avatar: form.avatar,
        ...(form.password ? { password: form.password } : {}),
      });
      setMessage('Profile updated');
      setForm((currentForm) => ({ ...currentForm, password: '' }));
    } catch (settingsError) {
      setError(
        settingsError instanceof Error
          ? settingsError.message
          : 'Profile could not be updated',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  const avatarLetter = form.name.slice(0, 1).toUpperCase() || 'U';

  return (
    <main className="settings-page">
      <section>
        <div className="section-heading">
          <p className="eyebrow">Account</p>
          <h1>Configuration</h1>
        </div>

        <form className="settings-form" onSubmit={submitSettings}>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </label>

          <label className="full-width-field">
            Avatar URL
            <input
              type="url"
              value={form.avatar}
              onChange={(event) => updateField('avatar', event.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </label>

          <label className="full-width-field">
            New password
            <input
              minLength={6}
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </label>

          {message && <p className="form-message success-message">{message}</p>}
          {error && <p className="form-message error-message">{error}</p>}

          <button
            className="primary-button wide-button"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Saving...' : 'Save configuration'}
          </button>
        </form>
      </section>

      <aside className="profile-preview">
        <h2>Profile</h2>
        {form.avatar ? (
          <img src={form.avatar} alt={form.name} />
        ) : (
          <div className="profile-avatar-fallback">{avatarLetter}</div>
        )}
        <strong>{form.name}</strong>
        <p>{form.email}</p>
        <span>{user?.role}</span>
      </aside>
    </main>
  );
}
