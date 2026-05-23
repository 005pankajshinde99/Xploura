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
        {children}
        <Footer />
      </body>
    </html>
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