 'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

export default function Navbar({ active }: { active?: string }) {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    _supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: listener } = _supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const dd = document.getElementById('nav-dd');
      if (dd && !dd.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const links = [
    { l: 'Home', h: '/' },
    { l: 'Trips', h: '/trips' },
    { l: 'Dates', h: '/dates' },
    { l: 'Cafes', h: '/cafes' },
    { l: 'Restaurants', h: '/restaurants' },
    { l: 'Adventure', h: '/adventure' },
    { l: 'X AI Agent', h: '/ai-agent' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      padding: '14px 48px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', zIndex: 100,
      background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* LOGO */}
      <a href="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.2em' }}>
          <span style={{ color: '#FF6B00' }}>X</span>
          <span style={{ color: '#fff' }}>PLOURA</span>
        </span>
      </a>

      {/* LINKS */}
      <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map(({ l, h }) => (
          <li key={h}>
            <a href={h} style={{
              fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase',
              color: active === l.toLowerCase() ? '#FF6B00' : 'rgba(255,255,255,0.45)',
              textDecoration: 'none', transition: 'color 0.3s'
            }}>{l}</a>
          </li>
        ))}
      </ul>

      {/* AUTH */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', position: 'relative' }}>
        {authLoading ? (
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        ) : user ? (
          <div style={{ position: 'relative' }} id="nav-dd">
            {/* Avatar */}
            <div onClick={() => setDropOpen(p => !p)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,107,0,0.15)', border: '1.5px solid #FF6B00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 16, color: '#FF6B00', userSelect: 'none'
            }}>
              {user.email?.[0]?.toUpperCase()}
            </div>

            {/* Dropdown */}
            {dropOpen && (
              <div style={{
                position: 'absolute', top: 46, right: 0,
                background: '#1a1714', border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: 10, minWidth: 180, zIndex: 999,
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)', overflow: 'hidden'
              }}>
                {/* Email */}
                <div style={{ padding: '12px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>Signed in as</div>
                  <div style={{ fontSize: 12, color: '#fff', fontWeight: 500, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 148 }}>
                    {user.email}
                  </div>
                </div>
                {/* Links */}
                {[{ label: 'My Bookings', href: '/bookings', icon: '📅' }, { label: 'Profile', href: '/profile', icon: '👤' }].map(item => (
                  <a key={item.href} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 16px', fontSize: 12,
                    color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                    borderBottom: '0.5px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.2s'
                  }}
                    onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,107,0,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = '#FF6B00'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'; }}>
                    {item.icon} {item.label}
                  </a>
                ))}
                {/* Sign Out */}
                <button onClick={async () => { await _supabase.auth.signOut(); window.location.href = '/'; }}
                  style={{
                    width: '100%', padding: '11px 16px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 12, color: 'rgba(255,80,80,0.75)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", textAlign: 'left'
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,50,50,0.08)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <a href="/auth" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', border: '0.5px solid rgba(255,255,255,0.12)', padding: '9px 20px', borderRadius: 24, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Sign In</a>
            <a href="/auth?tab=signup" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#FF6B00', color: '#fff', padding: '9px 20px', borderRadius: 24, textDecoration: 'none' }}>Get Started</a>
          </>
        )}
      </div>
    </nav>
  );
}
