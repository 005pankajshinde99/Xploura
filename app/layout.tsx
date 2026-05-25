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
  <style dangerouslySetInnerHTML={{__html: `
    .hcard, .hcard-featured, .hcard-t1, .hcard-t2 {
      position: absolute;
      border-radius: 16px;
      overflow: hidden;
    }
    @media (max-width: 768px) {
      .hero-inner { flex-direction: row !important; padding: 5px 14px 20px !important; align-items: center !important; }
      .hero-left { flex: 0 0 47% !important; width: 47% !important; }
      .hero-right { flex: 0 0 51% !important; width: 51% !important; height: 100% !important; overflow: visible !important; }
      .hero-h1 .hs1, .hero-h1 .hs2, .hero-h1 .hs3 { font-size: clamp(38px,11vw,52px) !important; }
      .cards-stage { width: 180px !important; height: 310px !important; position: relative !important; display: block !important; margin: 0 !important; }
      .hcard-featured { position: absolute !important; width: 125px !important; height: 185px !important; left: 0 !important; top: 35% !important; transform: translateY(-50%) rotate(-4deg) !important; }
      .hcard-t1 { position: absolute !important; width: 108px !important; height: 148px !important; right: -15px !important; top: -20px !important; }
      .hcard-t2 { position: absolute !important; width: 108px !important; height: 148px !important; right: -15px !important; top: 132px !important; bottom: auto !important; }
    }
  `}} />
</head>
      <body>
        {children}
      </body>
    </html>
  );
}