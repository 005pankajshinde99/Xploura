'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

const links = [
  { l: 'Home',        h: '/' },
  { l: 'Dates',       h: '/dates' },
  { l: 'Cafes',       h: '/cafes' },
  { l: 'Adventure',   h: '/adventure' },
  { l: 'Gift/Date Box',    h: '/giftbox' },
  { l: 'X AI Agent',  h: '/ai-agent' },
];

const exploreLinks = [
  { l: 'Restaurants', h: '/restaurants' },
  { l: 'Vibes',       h: '/vibes' },
  { l: 'Trips',       h: '/trips' },
];

export default function Navbar({ active }: { active?: string }) {
  const [user, setUser]           = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropOpen, setDropOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobile, setIsMobile]   = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
const exploreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── mobile detection ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── auth ── */
  useEffect(() => {
    _supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: listener } = _supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
      setAuthLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node))
        setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .xp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px;
          height: 56px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease;
        }
        .xp-nav.at-top {
          background: transparent;
          border-bottom: 1px solid transparent;
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
        }
        .xp-nav.scrolled {
          background: rgba(10, 10, 12, 0.72);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }

        /* ── Logo ── */
        .xp-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.22em;
          text-decoration: none;
          flex-shrink: 0;
        }
        .xp-logo-x   { color: #FF6B00; }
        .xp-logo-rest{ color: #fff; }

        /* ── Nav links container ── */
        .xp-links-wrap {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px 6px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .xp-link {
          position: relative;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.45);
          transition: color 0.2s;
          white-space: nowrap;
        }
        .xp-link:hover, .xp-link.hovered { color: rgba(255,255,255,0.85); }
        .xp-link.active-link { color: #fff; }
        .xp-link-pill {
          position: absolute; inset: 0;
          border-radius: 999px;
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.11);
        }
        .xp-link-pill.orange {
          background: rgba(255,107,0,0.15);
          border-color: rgba(255,107,0,0.25);
        }

        /* ── Auth buttons ── */
        .xp-btn-signin {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.14);
          padding: 7px 18px; border-radius: 999px;
          color: rgba(255,255,255,0.55); text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          background: transparent;
        }
        .xp-btn-signin:hover {
          border-color: rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.85);
        }
        .xp-btn-started {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          background: #FF6B00; color: #fff;
          padding: 7px 18px; border-radius: 999px;
          text-decoration: none;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .xp-btn-started:hover {
          background: #ff7d1a;
          box-shadow: 0 0 20px rgba(255,107,0,0.35);
        }

        /* ── Avatar ── */
        .xp-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,107,0,0.12);
          border: 1.5px solid rgba(255,107,0,0.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .xp-avatar:hover { background: rgba(255,107,0,0.22); border-color: #FF6B00; }

        /* ── Dropdown ── */
        .xp-dropdown {
          position: absolute; top: 46px; right: 0;
          background: rgba(18, 17, 16, 0.92);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px; min-width: 206px; z-index: 9999;
          box-shadow: 0 20px 50px rgba(0,0,0,0.65);
          overflow: hidden;
          animation: ddIn 0.18s cubic-bezier(0.23,1,0.32,1);
          transform-origin: top right;
        }
        @keyframes ddIn {
          from { opacity:0; transform: scale(0.94) translateY(-6px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .xp-dd-email-area { padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .xp-dd-label { font-size: 9px; color: rgba(255,255,255,0.25); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
        .xp-dd-email { font-size: 12px; color: #fff; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px; }
        .xp-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; font-size: 12.5px;
          color: rgba(255,255,255,0.6); text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer; background: transparent; border-left: none; border-right: none; border-top: none;
          width: 100%; font-family: 'DM Sans', sans-serif; text-align: left;
        }
        .xp-dd-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.9); }
        .xp-dd-item.danger { color: rgba(255,80,80,0.75); border-bottom: none; }
        .xp-dd-item.danger:hover { background: rgba(255,50,50,0.07); color: rgba(255,100,100,1); }
        .xp-skel { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.05); }

        .xp-explore-drop {
  position: absolute;
  top: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 13, 11, 0.98);
  border: 0.5px solid rgba(255, 107, 0, 0.2);
  border-radius: 14px;
  min-width: 180px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,107,0,0.05);
  overflow: hidden;
  z-index: 999;
  animation: ddIn 0.18s cubic-bezier(0.23,1,0.32,1);
}
.xp-explore-drop a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  border-bottom: 0.5px solid rgba(255,255,255,0.05);
  transition: background 0.15s, color 0.15s, padding-left 0.15s;
  font-family: 'DM Sans', sans-serif;
}
.xp-explore-drop a:last-child {
  border-bottom: none;
}
.xp-explore-drop a:hover {
  background: rgba(255,107,0,0.08);
  color: #FF6B00;
  padding-left: 22px;
}

        /* ══════════════════════════════
           MOBILE — max-width: 768px
           Logo ✅  |  Nav tabs ❌  |  Auth (only if logged out) ✅
           ══════════════════════════════ */
        @media (max-width: 768px) {
          .xp-nav {
            padding: 0 16px;
            height: 52px;
          }
          /* Hide nav tab pills */
          .xp-links-wrap {
            display: none !important;
          }
          /* Hide avatar & skeleton — profile handled by bottom nav */
          .xp-mobile-hide {
            display: none !important;
          }
          /* Smaller auth buttons on mobile */
          .xp-btn-signin {
            font-size: 10px;
            padding: 6px 13px;
            letter-spacing: 0.08em;
          }
          .xp-btn-started {
            font-size: 10px;
            padding: 6px 13px;
            letter-spacing: 0.08em;
          }
            .xp-nav.at-top {
    background: rgba(10, 10, 12, 0.92) !important;
    border-bottom: 1px solid rgba(255,255,255,0.06) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
  }
    
        }
      `}
      
      </style>

      <nav className={`xp-nav ${scrolled ? 'scrolled' : 'at-top'}`}>

        {/* LOGO — always visible */}
        <a href="/" className="xp-logo">
          <span className="xp-logo-x">X</span>
          <span className="xp-logo-rest">PLOURA</span>
        </a>

        {/* LINKS — hidden on mobile */}
        <div className="xp-links-wrap">
          {links.map(({ l, h }) => {
            const isActive  = active === l.toLowerCase();
            const isHovered = hoveredLink === l;
            return (
              <a
                key={h}
                href={h}
                className={`xp-link${isActive ? ' active-link' : ''}${isHovered ? ' hovered' : ''}`}
                onMouseEnter={() => setHoveredLink(l)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {(isActive || isHovered) && (
                  <span className={`xp-link-pill${isActive ? ' orange' : ''}`} />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{l}</span>
              </a>
            );
          })}

       <div
  ref={exploreRef}
  style={{ position: 'relative' }}
  onMouseEnter={() => {
    if (exploreTimerRef.current) clearTimeout(exploreTimerRef.current);
    setHoveredLink('explore');
  }}
  onMouseLeave={() => {
    exploreTimerRef.current = setTimeout(() => {
      setHoveredLink(null);
    }, 150);
  }}
>
  <div
    className={`xp-link${hoveredLink === 'explore' ? ' hovered' : ''}`}
    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
  >
    {hoveredLink === 'explore' && <span className="xp-link-pill" />}
    <span style={{ position: 'relative', zIndex: 1 }}>Explore</span>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ position: 'relative', zIndex: 1, opacity: 0.5 }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>

  {hoveredLink === 'explore' && (
    <div
      className="xp-explore-drop"
      onMouseEnter={() => {
        if (exploreTimerRef.current) clearTimeout(exploreTimerRef.current);
      }}
      onMouseLeave={() => {
        exploreTimerRef.current = setTimeout(() => {
          setHoveredLink(null);
        }, 150);
      }}
    >
      {exploreLinks.map(({ l, h }) => (
        <a key={h} href={h}>
          {l === 'Restaurants' && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/>
              <path d="M7 2v20"/>
            </svg>
          )}
          {l === 'Vibes' && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          )}
          {l === 'Trips' && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 010 20"/>
            </svg>
          )}
          {l}
        </a>
      ))}
    </div>
  )}
</div>
        </div>

        {/* AUTH */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
          {authLoading ? (
            /* skeleton — hidden on mobile */
            <div className={`xp-skel${isMobile ? ' xp-mobile-hide' : ''}`} />
          ) : user ? (
            /* Logged in: show avatar on desktop, hide on mobile (bottom nav handles it) */
            <div
              ref={ddRef}
              style={{ position: 'relative' }}
              className={isMobile ? 'xp-mobile-hide' : ''}
            >
              <div className="xp-avatar" onClick={() => setDropOpen(p => !p)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              {dropOpen && (
                <div className="xp-dropdown">
                  <div className="xp-dd-email-area">
                    <div className="xp-dd-label">Signed in as</div>
                    <div className="xp-dd-email">{user.email}</div>
                  </div>
                  <a href="/bookings" className="xp-dd-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    My Bookings
                  </a>
                  <a href="/profile" className="xp-dd-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </a>
                  <button
                    className="xp-dd-item danger"
                    onClick={async () => { await _supabase.auth.signOut(); window.location.href = '/'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
            /* Not logged in: show Sign In + Get Started on BOTH mobile and desktop */
            <>
              <a href="/auth" className="xp-btn-signin">Sign In</a>
              <a href="/auth?tab=signup" className="xp-btn-started">Get Started</a>
            </>
          )}
        </div>
      </nav>
      {/* ── MOBILE BOTTOM NAV ── */}
{isMobile && (
  <div style={{
    position: 'fixed', bottom: 0, left: 0, right: 0,
    height: 64, background: '#0f0d0b',
    borderTop: '0.5px solid rgba(255,255,255,0.08)',
    zIndex: 9999, display: 'flex',
    alignItems: 'center', justifyContent: 'space-around',
    padding: '0 8px', fontFamily: "'DM Sans', sans-serif",
  }}>
    {[
      {
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
        label: 'Home', href: '/'
      },
      {
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
        label: 'Explore', href: '/#explore'
      },
      { icon: null, label: 'AI', href: '/ai-agent', isCenter: true },
      {
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
        label: 'Bookings', href: '/userbooking'
      },
      {
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
        label: 'Profile', href: '/auth'
      },
    ].map((btn, i) => {
      const isActive =
        (btn.label === 'Home' && active === 'home') ||
        (btn.label === 'Explore' && active === 'explore') ||
        (btn.label === 'AI' && active === 'x ai agent') ||
        (btn.label === 'Bookings' && active === 'bookings') ||
        (btn.label === 'Profile' && active === 'profile');
      return (
        <a key={i} href={btn.href} style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 4,
          color: isActive ? '#FF6B00' : 'rgba(255,255,255,0.4)',
          textDecoration: 'none', padding: '8px 12px',
          marginTop: (btn as any).isCenter ? -20 : 0,
        }}>
          {(btn as any).isCenter ? (
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#FF6B00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(255,107,0,0.5)',
              border: '3px solid #0f0d0b',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22, color: '#fff',
            }}>X</div>
          ) : btn.icon}
          <span style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {btn.label}
          </span>
        </a>
      );
    })}
  </div>
)}
    </>
  );
}