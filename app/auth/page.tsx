'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <path d="M47.532 24.552c0-1.636-.147-3.21-.418-4.728H24.48v8.95h12.958c-.56 3.01-2.24 5.56-4.77 7.272v6.04h7.727c4.52-4.163 7.137-10.3 7.137-17.534z" fill="#4285F4"/>
    <path d="M24.48 48c6.503 0 11.953-2.155 15.937-5.84l-7.727-6.04c-2.155 1.446-4.91 2.305-8.21 2.305-6.31 0-11.658-4.26-13.57-9.986H3.004v6.24C6.97 43.197 15.17 48 24.48 48z" fill="#34A853"/>
    <path d="M10.91 28.44a14.37 14.37 0 0 1-.748-4.44c0-1.544.268-3.045.748-4.44v-6.24H3.004A24.005 24.005 0 0 0 .48 24c0 3.872.927 7.536 2.524 10.68l7.905-6.24z" fill="#FBBC05"/>
    <path d="M24.48 9.574c3.557 0 6.748 1.222 9.264 3.624l6.942-6.942C36.427 2.38 30.98 0 24.48 0 15.17 0 6.97 4.803 3.004 13.32l7.905 6.24c1.913-5.727 7.26-9.986 13.571-9.986z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);


export default function AuthPage() {
  const [tab, setTab] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'signup') setTab('signup');
    _supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && params.get('tab') !== 'signup') {
        window.location.href = '/';
      }
    });
  }, []);

  async function handleSubmit() {
    setMsg({ text: '', type: '' });
    setLoading(true);

    if (tab === 'signup') {
      const { data, error } = await _supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name } },
      });
      if (error) setMsg({ text: error.message, type: 'error' });
      else if (data?.user?.identities?.length === 0)
        setMsg({ text: 'Email already registered. Please sign in.', type: 'error' });
      else setMsg({ text: '✅ Check your email to confirm your account!', type: 'success' });
    } else {
      const { data, error } = await _supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) setMsg({ text: error.message, type: 'error' });
      else {
        setMsg({ text: '✅ Welcome back! Redirecting...', type: 'success' });
        setTimeout(() => { window.location.href = '/'; }, 1200);
      }
    }
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          color: #fff;
          min-height: 100vh;
        }

        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background glow */
        .auth-root::before {
          content: '';
          position: fixed;
          top: -30%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(255,107,0,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: #111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 36px 32px 32px;
          box-shadow: 0 0 0 1px rgba(255,107,0,0.04), 0 32px 80px rgba(0,0,0,0.7);
        }

        /* Logo */
        .auth-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
          text-decoration: none;
        }

        .auth-logo-icon {
          width: 36px;
          height: 36px;
          background: #FF6B00;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.05em;
          color: #fff;
          flex-shrink: 0;
        }

        .auth-logo-text {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 30px;
  letter-spacing: 0.18em;
  color: #fff;
}

        /* Heading */
        .auth-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          letter-spacing: 0.05em;
          color: #fff;
          text-align: center;
          margin-bottom: 6px;
        }

        .auth-subheading {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          text-align: center;
          letter-spacing: 0.04em;
          margin-bottom: 28px;
          line-height: 1.6;
        }

        /* Tabs */
        .auth-tabs {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 24px;
          gap: 4px;
        }

        .auth-tab {
          flex: 1;
          padding: 9px 0;
          border: none;
          border-radius: 7px;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255,255,255,0.4);
        }

        .auth-tab.active {
          background: rgba(255,107,0,0.15);
          color: #FF6B00;
          border: 1px solid rgba(255,107,0,0.2);
        }

        /* Social login buttons */
        .social-row {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .social-btn {
          flex: 1;
          padding: 11px 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255,255,255,0.7);
          gap: 6px;
        }

        .social-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
        }

        .social-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.55);
        }

        /* Divider */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .auth-divider span {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Inputs */
        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }

        .auth-input-wrap {
          position: relative;
        }

        .auth-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .auth-input:focus {
          border-color: rgba(255,107,0,0.45);
          background: rgba(255,255,255,0.05);
        }

        .auth-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .auth-input.with-btn {
          padding-right: 48px;
        }

        .pw-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: rgba(255,255,255,0.3);
          padding: 2px;
          line-height: 1;
        }

        /* Message */
        .auth-msg {
          padding: 11px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .auth-msg.error {
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.2);
          color: #ff6b6b;
        }

        .auth-msg.success {
          background: rgba(74,222,128,0.07);
          border: 1px solid rgba(74,222,128,0.18);
          color: #4ade80;
        }

        /* Submit button */
        .auth-submit {
          width: 100%;
          padding: 14px;
          background: #FF6B00;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 4px;
        }

        .auth-submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .auth-submit:active:not(:disabled) {
          transform: translateY(0px);
        }

        .auth-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* Footer links */
        .auth-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          line-height: 1.8;
        }

        .auth-footer a {
          color: #FF6B00;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        .auth-back {
          display: block;
          margin-top: 8px;
          color: rgba(255,107,0,0.55);
          font-size: 12px;
          text-decoration: none;
          text-align: center;
        }

        .auth-back:hover { color: #FF6B00; }

        /* Category chips at bottom */
        .auth-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
          margin-top: 22px;
        }

        .auth-chip {
          padding: 4px 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
        }
      `}</style>

      <div className="auth-root">
        <div className="auth-card">

          {/* Logo */}
          <a href="/" className="auth-logo">
  <span className="auth-logo-text">
    <span style={{ color: '#FF6B00' }}>X</span>PLOURA
  </span>
</a>

          {/* Heading */}
          <div className="auth-heading">
            {tab === 'signin' ? 'Welcome Back' : 'Start Exploring'}
          </div>
          <div className="auth-subheading">
            {tab === 'signin'
              ? 'Sign in to continue your journey'
              : 'Create your free Xploura account today'}
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => setTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => setTab('signup')}
            >
              Get Started
            </button>
          </div>

          {/* Social logins */}
          <div className="social-row">
  <button className="social-btn">
    <GoogleIcon />
    <span className="social-label">Google</span>
  </button>
  <button className="social-btn">
    <AppleIcon />
    <span className="social-label">Apple</span>
  </button>
</div>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {/* Message */}
          {msg.text && (
            <div className={`auth-msg ${msg.type}`}>{msg.text}</div>
          )}

          {/* Form */}
          <div className="auth-input-group">
            {tab === 'signup' && (
              <input
                className="auth-input"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            )}
            <input
              className="auth-input"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <div className="auth-input-wrap">
              <input
                className="auth-input with-btn"
                type={pwVisible ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button
                className="pw-toggle"
                onClick={() => setPwVisible(!pwVisible)}
                type="button"
                tabIndex={-1}
              >
                {pwVisible ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            className="auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : tab === 'signin'
              ? '→ Sign In'
              : '→ Create Account'}
          </button>

          {/* Footer */}
          <div className="auth-footer">
            {tab === 'signup' ? (
              <span>
                Already have an account?{' '}
                <a href="#" onClick={() => setTab('signin')}>Sign In →</a>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <a href="#" onClick={() => setTab('signup')}>Get Started free →</a>
              </span>
            )}
          </div>

          <a href="/" className="auth-back">← Back to Xploura</a>

          {/* Category chips */}
          <div className="auth-chips">
            {['Cafes', 'Dates', 'Adventure', 'Restaurants', 'Trips'].map(c => (
              <span key={c} className="auth-chip">{c}</span>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}