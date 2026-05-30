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
    { l: 'About', h: '/about' },
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
            {/* Avatar — SVG icon */}
            <div onClick={() => setDropOpen(p => !p)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,107,0,0.15)', border: '1.5px solid #FF6B00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', overflow: 'hidden'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            {/* Dropdown */}
            {dropOpen && (
              <div style={{
                position: 'absolute', top: 46, right: 0,
                background: '#1a1714', border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: 12, minWidth: 200, zIndex: 9999,
                boxShadow: '0 16px 40px rgba(0,0,0,0.7)', overflow: 'hidden',
                fontFamily: "'DM Sans', sans-serif"
              }}>
                {/* Email */}
                <div style={{ padding: '14px 18px', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Signed in as</div>
                  <div style={{ fontSize: 12, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                    {user.email}
                  </div>
                </div>

                {/* My Bookings */}
                <a href="/bookings" style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 18px', fontSize: 13,
                  color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                  borderBottom: '0.5px solid rgba(255,255,255,0.05)', transition: 'background 0.2s'
                }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,107,0,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = '#FF6B00'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'; }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  My Bookings
                </a>

                {/* Profile */}
                <a href="/profile" style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 18px', fontSize: 13,
                  color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                  borderBottom: '0.5px solid rgba(255,255,255,0.05)', transition: 'background 0.2s'
                }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,107,0,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = '#FF6B00'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'; }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profile
                </a>

                {/* Sign Out */}
                <button onClick={async () => { await _supabase.auth.signOut(); window.location.href = '/'; }}
                  style={{
                    width: '100%', padding: '12px 18px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontSize: 13, color: 'rgba(255,80,80,0.8)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", textAlign: 'left', transition: 'background 0.2s'
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,50,50,0.08)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
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