'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';

const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

export default function CafesPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Recommended');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    _supabase.from('cafes').select('*').eq('category', 'cafe').order('area', { ascending: true })
      .then(({ data }) => { setCards(data || []); setLoading(false); });
  }, []);

 const displayed = cards.filter(d =>
    !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.area?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
          else entry.target.classList.remove('visible');
        });
      },
      { threshold: 0.08 }
    );
    const timer = setTimeout(() => {
      document.querySelectorAll('.cafe-card').forEach(card => observer.observe(card));
    }, 300);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [displayed.length]);

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
        :root{--saffron:#FF6B00;--saffronL:#FF8C35}
        nav{position:fixed;top:0;left:0;right:0;padding:14px 48px;display:flex;align-items:center;justify-content:space-between;z-index:100;background:rgba(0,0,0,0.95);backdrop-filter:blur(20px);border-bottom:0.5px solid rgba(255,255,255,0.06)}
        .nav-logo{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:0.14em;color:#fff;text-decoration:none}
        .nav-links{display:flex;gap:28px;list-style:none}
        .nav-links a{font-size:11px;letter-spacing:0.13em;text-transform:uppercase;color:rgba(255,255,255,0.45);text-decoration:none;transition:color 0.3s}
        .nav-links a:hover,.nav-links a.active{color:#FF6B00}
        .nav-right{display:flex;gap:10px}
        .nb{font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border:0.5px solid rgba(255,255,255,0.15);padding:8px 18px;border-radius:24px;background:transparent;color:rgba(255,255,255,0.55);cursor:pointer;transition:all 0.3s;font-family:'DM Sans',sans-serif;text-decoration:none;display:inline-block}
        .nb:hover{border-color:#fff;color:#fff}
        .nb.fill{background:#FF6B00;color:#fff;border-color:#FF6B00}
        .nb.fill:hover{background:#FF8C35}

        /* HERO */
        .page-hero{position:relative;height:260px;display:flex;align-items:flex-end;overflow:hidden}
        .page-hero-bg{position:absolute;inset:-5%;background:url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80') center/cover;filter:brightness(0.25) saturate(0.7);z-index:0}
        .page-hero-overlay{position:absolute;inset:0;background:linear-gradient(110deg,rgba(0,0,0,0.98) 0%,rgba(0,0,0,0.6) 60%,rgba(0,0,0,0.2) 100%);z-index:1}
        .page-hero-inner{position:relative;z-index:2;padding:32px 48px;width:100%}
        .hero-breadcrumb{font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:10px}
        .hero-breadcrumb span{color:#FF6B00}
        .hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(44px,7vw,72px);line-height:0.88;letter-spacing:0.03em;margin-bottom:12px}
        .hero-title span{color:#FF6B00}
        .hero-meta{font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:0.08em}
        .hero-meta b{color:rgba(255,255,255,0.65)}

        /* SEARCH */
        .search-section{background:#0a0a0a;border-bottom:0.5px solid rgba(255,255,255,0.06);padding:14px 48px;display:flex;gap:12px;align-items:center}
        .search-bar{flex:1;display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);border-radius:5px;padding:10px 16px;transition:border-color 0.3s}
        .search-bar:focus-within{border-color:rgba(255,107,0,0.4)}
        .search-bar input{flex:1;background:transparent;border:none;outline:none;color:#fff;font-size:13px;font-family:'DM Sans',sans-serif}
        .search-bar input::placeholder{color:rgba(255,255,255,0.2)}
        .search-icon{color:rgba(255,255,255,0.25);flex-shrink:0}
        .sort-sel{background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);padding:10px 14px;border-radius:5px;font-size:11px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}

        /* LAYOUT */
        .page-layout{display:grid;grid-template-columns:220px 1fr}
        .sidebar{border-right:0.5px solid rgba(255,255,255,0.06);padding:24px 20px;position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto;scrollbar-width:none;background:#050505}
        .sidebar::-webkit-scrollbar{display:none}
        .sb-title{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:12px;margin-top:20px}
        .sb-title:first-child{margin-top:0}
        .sb-option{display:flex;align-items:center;justify-content:space-between;padding:8px 0;cursor:pointer;border-bottom:0.5px solid rgba(255,255,255,0.04)}
        .sb-opt-l{display:flex;align-items:center;gap:10px;font-size:12px;color:rgba(255,255,255,0.4);transition:color 0.2s}
        .sb-option:hover .sb-opt-l{color:rgba(255,255,255,0.8)}
        .sb-check{width:14px;height:14px;border:0.5px solid rgba(255,255,255,0.18);border-radius:2px;flex-shrink:0}
        .price-row{display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.3);margin:10px 0 6px}
        .slider{width:100%;-webkit-appearance:none;height:1px;background:rgba(255,255,255,0.1);outline:none}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#FF6B00;cursor:pointer}
        .sb-apply{width:100%;padding:10px;background:#FF6B00;color:#fff;border:none;border-radius:3px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;margin-top:20px;font-family:'DM Sans',sans-serif;transition:background 0.3s}
        .sb-apply:hover{background:#FF8C35}

        /* MAIN */
        .main-content{padding:24px 28px}
        .content-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
        .results-count{font-size:12px;color:rgba(255,255,255,0.3)}
        .results-count b{color:rgba(255,255,255,0.7)}

        /* CARDS */
        .cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .cafe-card{border-radius:8px;overflow:hidden;background:#0d0d0d;border:0.5px solid rgba(255,255,255,0.07);cursor:pointer;opacity:0;transform:translateY(24px);transition:opacity 0.5s ease,transform 0.5s ease}
        .cafe-card.visible{opacity:1;transform:translateY(0)}
        .cafe-card:hover{border-color:rgba(255,107,0,0.4);transform:translateY(-5px);box-shadow:0 20px 48px rgba(0,0,0,0.5)}
        .cafe-img{height:170px;overflow:hidden;position:relative}
        .cafe-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s}
        .cafe-card:hover .cafe-img img{transform:scale(1.06)}
        .cafe-img::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 100%);pointer-events:none;z-index:1}
        .cafe-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s}
        .cafe-card:hover .cafe-img img{transform:scale(1.06)}
        .cafe-tag-pill{position:absolute;top:10px;left:10px;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;background:rgba(0,0,0,0.75);border:0.5px solid rgba(255,255,255,0.15);padding:4px 8px;border-radius:2px;color:rgba(255,255,255,0.7);backdrop-filter:blur(8px)}
        .cafe-rating{position:absolute;top:10px;right:10px;font-size:9px;background:#FF6B00;padding:3px 8px;border-radius:2px;color:#fff;font-weight:500}
        .cafe-info{padding:14px}
        .cafe-area{font-size:8px;letter-spacing:0.16em;text-transform:uppercase;color:#FF6B00;margin-bottom:4px}
        .cafe-name{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:0.04em;color:#fff;margin-bottom:4px}
        .cafe-desc{font-size:10px;color:rgba(255,255,255,0.3);line-height:1.6;margin-bottom:10px}
        .cafe-footer{display:flex;align-items:center;justify-content:space-between;border-top:0.5px solid rgba(255,255,255,0.06);padding-top:10px}
        .cafe-price{font-size:13px;color:#fff;font-weight:500}
        .cafe-price span{font-size:9px;color:rgba(255,255,255,0.3);font-weight:400}
        .cafe-book{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#FF6B00;border:0.5px solid rgba(255,107,0,0.35);padding:5px 10px;border-radius:2px;background:transparent;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .cafe-book:hover{background:#FF6B00;color:#fff}

        /* EMPTY */
        .empty-state{grid-column:1/-1;text-align:center;padding:60px 20px;color:rgba(255,255,255,0.2)}
        .empty-icon{font-size:48px;margin-bottom:16px}
        .empty-text{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:0.06em;margin-bottom:8px}
        .empty-sub{font-size:12px;color:rgba(255,255,255,0.15)}

        /* LOADING */
        .loading-state{grid-column:1/-1;display:flex;justify-content:center;align-items:center;padding:60px;color:rgba(255,255,255,0.2);font-size:12px;letter-spacing:0.1em;text-transform:uppercase}

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
          .page-hero-inner{padding:20px 16px}
          .search-section{padding:12px 16px}
          .main-content{padding:16px}
          .cards-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* NAV */}
     <Navbar active="cafes" />

      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <div className="hero-breadcrumb">Home <span>/ Cafes</span></div>
          <div className="hero-title">Best <span>Cafes</span><br />in Pune</div>
          <div className="hero-meta"><b>{cards.length}</b> cafes listed · Artisan Coffee · Work Spots · Brunch</div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-section">
        <div className="search-bar">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cafes, areas..." />
        </div>
        <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
          <option>Recommended</option>
          <option>Rating: High to Low</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {/* LAYOUT */}
      <div className="page-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-title">Area</div>
          {['Koregaon Park','Baner','Kalyani Nagar','Viman Nagar','Camp','Kothrud','Wakad','Hinjewadi'].map(a => (
            <div key={a} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />{a}</div>
            </div>
          ))}

          <div className="sb-title">Vibe</div>
          {['Work Friendly','Pet Friendly','Outdoor Seating','Live Music','Rooftop','Instagrammable'].map(v => (
            <div key={v} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />{v}</div>
            </div>
          ))}

          <div className="sb-title">Budget per Head</div>
          <div className="price-row"><span>₹100</span><span>₹1,500</span></div>
          <input type="range" className="slider" min={100} max={1500} defaultValue={800} />

          <div className="sb-title">Rating</div>
          {['4.5+','4.0+','3.5+'].map(r => (
            <div key={r} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />⭐ {r}</div>
            </div>
          ))}

          <button className="sb-apply">Apply Filters</button>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          <div className="content-header">
            <div className="results-count"><b>{displayed.length}</b> cafes found</div>
          </div>

          <div className="cards-grid">
            {loading ? (
              <div className="loading-state">Loading cafes...</div>
            ) : displayed.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">☕</div>
                <div className="empty-text">No Cafes Found</div>
                <div className="empty-sub">Try a different search or check back later</div>
              </div>
            ) : displayed.map((d, i) => (
              <div key={i} className="cafe-card" onClick={() => openBooking(d)}>
                <div className="cafe-img">
                  {d.image_url && <img src={d.image_url} alt={d.name} />}
                  <div className="cafe-tag-pill">{d.tag || `Cafe · ${d.area}`}</div>
                  {d.rating && <div className="cafe-rating">⭐ {d.rating}</div>}
                </div>
                <div className="cafe-info">
                  <div className="cafe-area">{d.area}</div>
                  <div className="cafe-name">{d.name}</div>
                  <div className="cafe-desc">{d.description || 'A great cafe experience awaits you'}</div>
                  <div className="cafe-footer">
                    <div className="cafe-price">{d.price} <span>/head</span></div>
                    <button className="cafe-book">Reserve →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

     
    </>
  );
}