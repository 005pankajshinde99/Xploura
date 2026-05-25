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
          body { padding-bottom: 72px; cursor: auto; }
          #cursor, #cursor-ring { display: none; }
          nav#main-nav { padding: 10px 14px; }
          #hero { height: 100svh; overflow: hidden; display: flex; align-items: stretch; }
          .hbg { position: absolute; top: 0; left: 0; right: 0; bottom: auto; height: 58%; inset: unset; width: 100%; filter: grayscale(100%) contrast(1.1) brightness(0.5); }
          .hbg-overlay { background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.92) 56%, rgba(0,0,0,1) 100%); }
          .hbg-overlay-tb { display: none; }
          .hero-inner { flex-direction: row; padding: 5px 14px 20px; gap: 8px; align-items: flex-start; justify-content: space-between; height: 100%; width: 100%; }
          .hero-left { flex: 0 0 47%; width: 47%; padding: 0; }
          .hero-h1 .hs1, .hero-h1 .hs2, .hero-h1 .hs3 { font-size: clamp(38px, 11vw, 52px); line-height: 0.88; }
          .hero-right { flex: 0 0 51%; width: 51%; height: 100%; overflow: visible; display: flex; align-items: center; justify-content: flex-start; position: relative; }
          .cards-stage { width: 180px; height: 310px; position: relative; display: block; margin: 0; flex-shrink: 0; }
          .hcard-featured { position: absolute; width: 125px; height: 185px; left: 0; top: 5%; transform: translateY(-70%) rotate(-4deg); right: unset; bottom: unset; z-index: 4; }
          .hcard-t1 { position: absolute; width: 108px; height: 120px; right: -15px; top: -140px; left: unset; bottom: unset; transform: rotate(-4deg); z-index: 5; }
          .hcard-t2 { position: absolute; width: 108px; height: 120px; right: -15px; bottom: 125px; left: unset; top: unset; transform: rotate(-4deg); z-index: 3; }
          #mobile-nav { display: flex; }
          #ai-fab { display: none; }
          .cards-grid { grid-template-columns: 1fr; }
          .ai-grid { grid-template-columns: 1fr; }
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}