import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Xploura — Explore Every World',
  description: 'AI-Powered Booking Platform — Dates, Cafes, Adventure, Restaurants, Trips',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      padding: '22px 48px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', zIndex: 100,
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '0.5px solid rgba(255,255,255,0.06)'
    }}>
      <a href="/" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: '0.14em', color: '#fff', textDecoration: 'none' }}>
        Xploura
      </a>
      <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
        {[
          { label: 'Trips', href: '/#explore' },
          { label: 'Dates', href: '/#explore' },
          { label: 'Cafes', href: '/#explore' },
          { label: 'Restaurants', href: '/#explore' },
          { label: 'Adventure', href: '/#explore' },
          { label: 'X AI Agent', href: '/ai-agent' },
        ].map(l => (
          <li key={l.label}>
            <a href={l.href} style={{ fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: 10 }}>
        <a href="/auth" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', border: '0.5px solid rgba(255,255,255,0.12)', padding: '9px 20px', borderRadius: 24, background: 'transparent', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
          Sign in
        </a>
        <a href="/auth?tab=signup" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#FF6B00', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 24, textDecoration: 'none' }}>
          Get Started
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <>
      <footer style={{ background: '#000', padding: '60px 48px 40px', borderTop: '0.5px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 38 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.07)' }}>Xploura</div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 14, lineHeight: 1.8, maxWidth: 210 }}>
            Explore the world with AI — travel, events, sports, dining in one place.
          </p>
        </div>
        {[
          { title: 'Explore', links: ['Travel & Trips', 'Shows & Concerts', 'Sports Events', 'Cafes & Restaurants'] },
          { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog'] },
          { title: 'Contact', links: ['hello@xploura.in', 'Instagram', 'Twitter / X', 'LinkedIn'] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 18 }}>{col.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {col.links.map(l => (
                <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        ))}
      </footer>
      <div style={{ background: '#000', padding: '20px 48px', borderTop: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)' }}>© 2026 Xploura. All rights reserved.</span>
        <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)' }}>Built with passion in India</span>
      </div>
    </>
  );
}