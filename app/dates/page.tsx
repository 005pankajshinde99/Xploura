'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

const MOODS = [
  { l: 'All', v: '', icon: '✦' },
  { l: 'Rooftop', v: 'rooftop', icon: '🌆' },
  { l: 'Fine Dining', v: 'fine-dining', icon: '🍷' },
  { l: 'Outdoor', v: 'outdoor', icon: '🌿' },
  { l: 'Sunset View', v: 'sunset', icon: '🌅' },
  { l: 'Cozy Cafe', v: 'cozy', icon: '☕' },
  { l: 'Live Music', v: 'live-music', icon: '🎵' },
  { l: 'Luxury', v: 'luxury', icon: '💎' },
];

const FEATURED_DATES = [
  { title: 'Paasha Rooftop', sub: 'JW Marriott · Koregaon Park · 4.9★', tag: 'DATE NIGHT · KP', price: '₹2,500/head', badge: '🔥 Hot', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', vibe: 'Romantic · Rooftop · City View' },
  { title: 'The Flour Works', sub: 'Kalyani Nagar · 4.8★', tag: 'COZY CAFE · KN', price: '₹800/head', badge: '❤️ Loved', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', vibe: 'Cozy · Artisan Coffee · Garden' },
  { title: 'Dirty Boots', sub: 'Viman Nagar · 4.7★', tag: 'OUTDOOR · VN', price: '₹1,200/head', badge: '✨ Trending', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', vibe: 'Outdoor · Rustic · Live Music' },
];

const VIBE_PICKS = [
  { title: 'Romantic Evenings', count: 18, color: '#8B0000', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70' },
  { title: 'Cozy Cafes', count: 24, color: '#4a3728', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=70' },
  { title: 'Rooftop Bars', count: 12, color: '#1a1a4e', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=70' },
  { title: 'Live Music', count: 9, color: '#1a3a1a', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=70' },
];

export default function DatesPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [mood, setMood] = useState('');
  const [search, setSearch] = useState('');
  const [dateVal, setDateVal] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    _supabase.from('cafes').select('*').eq('category', 'date').then(({ data }) => setCards(data || []));
  }, []);

  const displayed = cards.filter(d =>
    (!search || d.name?.toLowerCase().includes(search.toLowerCase()))
  );

  function openBooking(d: any) {
    window.location.href = `/booking?data=${encodeURIComponent(JSON.stringify(d))}`;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:#000;color:#fff;font-family:'DM Sans',sans-serif;overflow-x:hidden;padding-top:64px;padding-bottom:72px}
        :root{--saffron:#FF6B00;--saffronL:#FF8C35;--rose:#c0392b}
        nav{position:fixed;top:0;left:0;right:0;padding:14px 48px;display:flex;align-items:center;justify-content:space-between;z-index:100;background:rgba(0,0,0,0.95);backdrop-filter:blur(20px);border-bottom:0.5px solid rgba(255,255,255,0.06)}
        .nav-logo{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:0.14em;color:#fff;text-decoration:none}
        .nav-links{display:flex;gap:28px;list-style:none}
        .nav-links a{font-size:11px;letter-spacing:0.13em;text-transform:uppercase;color:rgba(255,255,255,0.45);text-decoration:none;transition:color 0.3s}
        .nav-links a:hover,.nav-links a.active{color:#FF6B00}
        .nav-right{display:flex;gap:10px}
        .nb{font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border:0.5px solid rgba(255,255,255,0.15);padding:8px 18px;border-radius:24px;background:transparent;color:rgba(255,255,255,0.55);cursor:pointer;transition:all 0.3s;font-family:'DM Sans',sans-serif}
        .nb:hover{border-color:#fff;color:#fff}
        .nb.fill{background:#FF6B00;color:#fff;border-color:#FF6B00}
        /* HERO */
        .dates-hero{position:relative;height:380px;display:flex;align-items:center;overflow:hidden;background:#000}
        .dates-hero-bg{position:absolute;inset:-5%;background:url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80') center/cover;filter:brightness(0.22) saturate(0.8);z-index:0}
        .dates-hero-overlay{position:absolute;inset:0;background:linear-gradient(110deg,rgba(0,0,0,0.98) 0%,rgba(0,0,0,0.7) 45%,rgba(0,0,0,0.2) 100%);z-index:1}
        .dates-hero-inner{position:relative;z-index:2;padding:40px 48px;width:100%;max-width:680px}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;border:0.5px solid rgba(255,107,0,0.3);padding:5px 12px;border-radius:20px;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,107,0,0.85);margin-bottom:18px;background:rgba(255,107,0,0.06)}
        .hdot{width:5px;height:5px;border-radius:50%;background:#FF6B00;animation:blink 2s infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        .dates-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,8vw,90px);line-height:0.85;letter-spacing:0.02em;margin-bottom:16px}
        .dates-title span{color:#FF6B00}
        .dates-sub{font-size:12px;letter-spacing:0.06em;color:rgba(255,255,255,0.32);line-height:1.9;text-transform:uppercase;margin-bottom:28px}
        /* BOOKING WIDGET */
        .booking-widget{background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.12);border-radius:6px;padding:18px;display:flex;gap:0;overflow:hidden;max-width:620px}
        .bw-field{flex:1;padding:0 16px;border-right:0.5px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;gap:4px}
        .bw-field:last-of-type{border-right:none}
        .bw-label{font-size:8px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.3)}
        .bw-input{background:transparent;border:none;outline:none;color:#fff;font-size:13px;font-family:'DM Sans',sans-serif;width:100%}
        .bw-input::placeholder{color:rgba(255,255,255,0.2)}
        .bw-btn{background:#FF6B00;color:#fff;border:none;padding:0 24px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;transition:background 0.3s;flex-shrink:0;border-radius:4px;margin:0 -18px -18px;margin-left:12px}
        .bw-btn:hover{background:#FF8C35}
        /* MOOD FILTER */
        .mood-section{padding:20px 48px;background:#050505;border-bottom:0.5px solid rgba(255,255,255,0.05);overflow-x:auto;scrollbar-width:none}
        .mood-section::-webkit-scrollbar{display:none}
        .mood-title{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);margin-bottom:12px}
        .mood-row{display:flex;gap:8px}
        .mood-chip{display:flex;align-items:center;gap:6px;padding:8px 14px;border:0.5px solid rgba(255,255,255,0.1);border-radius:3px;font-size:11px;color:rgba(255,255,255,0.4);background:transparent;cursor:pointer;white-space:nowrap;transition:all 0.25s;font-family:'DM Sans',sans-serif}
        .mood-chip:hover{border-color:rgba(255,107,0,0.5);color:#FF8C35}
        .mood-chip.active{border-color:#FF6B00;color:#fff;background:rgba(255,107,0,0.12)}
        /* VIBE PICKS */
        .vibe-section{padding:32px 48px;background:#000;border-bottom:0.5px solid rgba(255,255,255,0.05)}
        .section-label{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.22);margin-bottom:6px}
        .section-heading{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:0.04em;color:#fff;margin-bottom:18px}
        .vibe-row{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none}
        .vibe-row::-webkit-scrollbar{display:none}
        .vibe-card{flex:0 0 200px;height:120px;border-radius:6px;overflow:hidden;position:relative;cursor:pointer;border:0.5px solid rgba(255,255,255,0.06);transition:transform 0.3s}
        .vibe-card:hover{transform:translateY(-3px)}
        .vibe-card-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:brightness(0.35)}
        .vibe-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 100%)}
        .vibe-card-content{position:absolute;bottom:12px;left:14px;right:14px}
        .vibe-card-title{font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:0.04em;color:#fff}
        .vibe-card-count{font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:0.08em;margin-top:2px}
        /* PAGE LAYOUT */
        .page-layout{display:grid;grid-template-columns:240px 1fr;gap:0}
        /* SIDEBAR */
        .sidebar{border-right:0.5px solid rgba(255,255,255,0.06);padding:28px 24px;position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto;scrollbar-width:none;background:#050505}
        .sidebar::-webkit-scrollbar{display:none}
        .sb-title{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:14px;margin-top:8px}
        .sb-title:first-child{margin-top:0}
        .sb-option{display:flex;align-items:center;justify-content:space-between;padding:8px 0;cursor:pointer;border-bottom:0.5px solid rgba(255,255,255,0.04)}
        .sb-opt-l{display:flex;align-items:center;gap:10px;font-size:12px;color:rgba(255,255,255,0.45);transition:color 0.2s}
        .sb-option:hover .sb-opt-l{color:rgba(255,255,255,0.8)}
        .sb-check{width:14px;height:14px;border:0.5px solid rgba(255,255,255,0.2);border-radius:2px;flex-shrink:0}
        .sb-count{font-size:9px;color:rgba(255,255,255,0.2)}
        .price-row{display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px;margin-top:12px}
        .slider{width:100%;-webkit-appearance:none;height:1px;background:rgba(255,255,255,0.1);outline:none}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#FF6B00;cursor:pointer}
        .sb-apply{width:100%;padding:10px;background:#FF6B00;color:#fff;border:none;border-radius:3px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;margin-top:20px;font-family:'DM Sans',sans-serif}
        /* MAIN */
        .main-content{padding:28px 32px}
        .content-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
        .results-count{font-size:12px;color:rgba(255,255,255,0.3)}
        .results-count b{color:rgba(255,255,255,0.7)}
        .sort-sel{background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);padding:7px 12px;border-radius:3px;font-size:11px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}
        /* CARDS */
        .dates-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .date-card{border-radius:8px;overflow:hidden;background:#0d0d0d;border:0.5px solid rgba(255,255,255,0.07);cursor:pointer;transition:all 0.35s;position:relative}
        .date-card:hover{border-color:rgba(255,107,0,0.4);transform:translateY(-5px);box-shadow:0 20px 48px rgba(255,107,0,0.08)}
        .date-img{height:180px;overflow:hidden;position:relative}
        .date-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s}
        .date-card:hover .date-img img{transform:scale(1.06)}
        .date-badge{position:absolute;top:10px;left:10px;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;background:rgba(0,0,0,0.75);border:0.5px solid rgba(255,255,255,0.15);padding:4px 8px;border-radius:2px;color:rgba(255,255,255,0.7);backdrop-filter:blur(8px)}
        .date-rating{position:absolute;top:10px;right:10px;font-size:9px;background:#FF6B00;padding:3px 8px;border-radius:2px;color:#fff;font-weight:500}
        .date-heart{position:absolute;bottom:10px;right:10px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.6);border:0.5px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:12px;backdrop-filter:blur(8px);transition:all 0.2s}
        .date-card:hover .date-heart{background:rgba(255,107,0,0.8)}
        .date-info{padding:14px}
        .date-vibe{font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:#FF6B00;margin-bottom:4px}
        .date-name{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:0.04em;color:#fff;margin-bottom:3px}
        .date-sub{font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:10px;line-height:1.5}
        .date-tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px}
        .date-tag-pill{padding:3px 8px;border:0.5px solid rgba(255,255,255,0.1);border-radius:2px;font-size:8px;letter-spacing:0.08em;color:rgba(255,255,255,0.35)}
        .date-footer{display:flex;align-items:center;justify-content:space-between;border-top:0.5px solid rgba(255,255,255,0.06);padding-top:10px}
        .date-price{font-size:13px;color:#fff;font-weight:500}
        .date-price span{font-size:9px;color:rgba(255,255,255,0.3);font-weight:400}
        .date-book{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#FF6B00;border:0.5px solid rgba(255,107,0,0.35);padding:5px 10px;border-radius:2px;background:transparent;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .date-book:hover{background:#FF6B00;color:#fff}
        /* MOBILE NAV */
        #mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;height:64px;background:#000;border-top:0.5px solid rgba(255,255,255,0.08);z-index:999;align-items:center;justify-content:space-around;padding:0 8px}
        .mnav-btn{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 12px;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif}
        .mnav-btn span{font-size:9px;letter-spacing:0.06em;text-transform:uppercase}
        .mnav-ai-btn{width:52px;height:52px;border-radius:50%;background:#FF6B00;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(255,107,0,0.5);border:3px solid #000;font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff}
        @media(max-width:1024px){
          nav ul{display:none!important}
          #mobile-nav{display:flex!important}
          .page-layout{grid-template-columns:1fr}
          .sidebar{display:none}
          .dates-hero-inner{padding:24px 16px;max-width:100%}
          .mood-section{padding:14px 16px}
          .vibe-section{padding:20px 16px}
          .main-content{padding:16px}
          .dates-grid{grid-template-columns:1fr!important}
          .booking-widget{flex-direction:column;gap:12px}
          .bw-field{border-right:none;border-bottom:0.5px solid rgba(255,255,255,0.08);padding:0 0 12px}
          .bw-btn{margin:0;padding:12px}
        }
      `}</style>

      <nav>
        <a href="/" className="nav-logo">Xploura</a>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/trips">Trips</a></li>
          <li><a href="/dates" className="active">Dates</a></li>
          <li><a href="/cafes">Cafes</a></li>
          <li><a href="/restaurants">Restaurants</a></li>
          <li><a href="/adventure">Adventure</a></li>
          <li><a href="/ai-agent">X AI Agent</a></li>
        </ul>
        <div className="nav-right">
          <button className="nb">Sign In</button>
          <button className="nb fill">Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="dates-hero">
        <div className="dates-hero-bg" />
        <div className="dates-hero-overlay" />
        <div className="dates-hero-inner">
          <div className="hero-badge"><div className="hdot" />Perfect Date Spots</div>
          <div className="dates-title">Plan Your<br /><span>Perfect</span> Night</div>
          <div className="dates-sub">Rooftops · Fine Dining · Cozy Cafes · Live Music · Sunsets</div>
          <div className="booking-widget">
            <div className="bw-field">
              <div className="bw-label">📍 Location</div>
              <input className="bw-input" placeholder="Pune, Maharashtra" />
            </div>
            <div className="bw-field">
              <div className="bw-label">📅 Date</div>
              <input className="bw-input" type="date" value={dateVal} onChange={e => setDateVal(e.target.value)} style={{ colorScheme: 'dark' }} />
            </div>
            <div className="bw-field">
              <div className="bw-label">👥 Guests</div>
              <input className="bw-input" type="number" value={guests} onChange={e => setGuests(+e.target.value)} min={1} max={10} />
            </div>
            <button className="bw-btn">Find →</button>
          </div>
        </div>
      </div>

      {/* MOOD */}
      <div className="mood-section">
        <div className="mood-title">Filter by Vibe</div>
        <div className="mood-row">
          {MOODS.map(m => (
            <button key={m.v} className={`mood-chip${mood === m.v ? ' active' : ''}`} onClick={() => setMood(m.v)}>
              {m.icon} {m.l}
            </button>
          ))}
        </div>
      </div>

      {/* VIBE PICKS */}
      <div className="vibe-section">
        <div className="section-label">Curated for You</div>
        <div className="section-heading">Browse by Mood</div>
        <div className="vibe-row">
          {VIBE_PICKS.map((v, i) => (
            <div key={i} className="vibe-card">
              <div className="vibe-card-bg" style={{ backgroundImage: `url(${v.img})`, backgroundColor: v.color }} />
              <div className="vibe-card-overlay" />
              <div className="vibe-card-content">
                <div className="vibe-card-title">{v.title}</div>
                <div className="vibe-card-count">{v.count} Spots</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE LAYOUT */}
      <div className="page-layout">
        <aside className="sidebar">
          <div className="sb-title">Vibe / Ambiance</div>
          {['Rooftop', 'Fine Dining', 'Outdoor', 'Cozy Cafe', 'Live Music', 'Sunset View', 'Luxury', 'Casual'].map(v => (
            <div key={v} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />{v}</div>
              <div className="sb-count">{Math.floor(Math.random() * 20 + 3)}</div>
            </div>
          ))}

          <div className="sb-title" style={{ marginTop: 22 }}>Budget per Head</div>
          <div className="price-row"><span>₹200</span><span>₹5,000+</span></div>
          <input type="range" className="slider" min={200} max={5000} defaultValue={2500} />

          <div className="sb-title" style={{ marginTop: 22 }}>Area</div>
          {['Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Baner', 'Camp', 'Wakad'].map(a => (
            <div key={a} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />{a}</div>
            </div>
          ))}

          <div className="sb-title" style={{ marginTop: 22 }}>Rating</div>
          {['4.5+', '4.0+', '3.5+'].map(r => (
            <div key={r} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />⭐ {r}</div>
            </div>
          ))}

          <button className="sb-apply">Apply Filters</button>
        </aside>

        <main className="main-content">
          <div className="content-header">
            <div className="results-count"><b>{displayed.length || FEATURED_DATES.length}</b> date spots found</div>
            <select className="sort-sel">
              <option>Recommended</option>
              <option>Rating: High to Low</option>
              <option>Price: Low to High</option>
              <option>Most Popular</option>
            </select>
          </div>

          <div className="dates-grid">
            {(displayed.length > 0 ? displayed : FEATURED_DATES).map((d: any, i: number) => (
              <div key={i} className="date-card" onClick={() => displayed.length > 0 ? openBooking(d) : null}>
                <div className="date-img">
                  <img src={d.image_url || d.img} alt={d.name || d.title} />
                  <div className="date-badge">{d.tag || 'Date Spot'}</div>
                  <div className="date-rating">⭐ {d.rating || '4.8'}</div>
                  <div className="date-heart">♡</div>
                </div>
                <div className="date-info">
                  <div className="date-vibe">{d.vibe || 'Romantic · Evening'}</div>
                  <div className="date-name">{d.name || d.title}</div>
                  <div className="date-sub">{d.sub || d.description || 'Perfect for a memorable evening'}</div>
                  <div className="date-tags">
                    {['Candlelight', 'Reservations', 'Dress Code'].map(t => (
                      <div key={t} className="date-tag-pill">{t}</div>
                    ))}
                  </div>
                  <div className="date-footer">
                    <div className="date-price">{d.price} <span>/head</span></div>
                    <button className="date-book">Reserve →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <div id="mobile-nav">
        <button className="mnav-btn" onClick={() => window.location.href = '/'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </button>
        <button className="mnav-btn" style={{ color: '#FF6B00' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          <span style={{ color: '#FF6B00' }}>Dates</span>
        </button>
        <button className="mnav-btn" style={{ marginTop: -20 }} onClick={() => window.location.href = '/ai-agent'}>
          <div className="mnav-ai-btn">X</div>
          <span>AI</span>
        </button>
        <button className="mnav-btn" onClick={() => window.location.href = '/restaurants'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2"/><path d="M18.5 2A2.5 2.5 0 0121 4.5v0A2.5 2.5 0 0118.5 7h-1.5a2.5 2.5 0 01-2.5-2.5v0A2.5 2.5 0 0117 2h1.5z"/></svg>
          <span>Food</span>
        </button>
        <button className="mnav-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Profile</span>
        </button>
      </div>
    </>
  );
}