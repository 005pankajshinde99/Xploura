'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

export default function RestaurantsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Recommended');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    _supabase.from('cafes').select('*').eq('category', 'restaurant').order('area', { ascending: true })
      .then(({ data }) => { setCards(data || []); setLoading(false); });
  }, []);

  const displayed = cards.filter(d =>
    !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.area?.toLowerCase().includes(search.toLowerCase())
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
        .page-hero-bg{position:absolute;inset:-5%;background:url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80') center/cover;filter:brightness(0.22) saturate(0.6);z-index:0}
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
        .rest-card{border-radius:8px;overflow:hidden;background:#0d0d0d;border:0.5px solid rgba(255,255,255,0.07);cursor:pointer;transition:all 0.35s}
        .rest-card:hover{border-color:rgba(255,107,0,0.4);transform:translateY(-5px);box-shadow:0 20px 48px rgba(0,0,0,0.5)}
        .rest-img{height:170px;overflow:hidden;position:relative}
        .rest-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s}
        .rest-card:hover .rest-img img{transform:scale(1.06)}
        .rest-tag-pill{position:absolute;top:10px;left:10px;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;background:rgba(0,0,0,0.75);border:0.5px solid rgba(255,255,255,0.15);padding:4px 8px;border-radius:2px;color:rgba(255,255,255,0.7);backdrop-filter:blur(8px)}
        .rest-rating{position:absolute;top:10px;right:10px;font-size:9px;background:#FF6B00;padding:3px 8px;border-radius:2px;color:#fff;font-weight:500}
        .rest-info{padding:14px}
        .rest-area{font-size:8px;letter-spacing:0.16em;text-transform:uppercase;color:#FF6B00;margin-bottom:4px}
        .rest-name{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:0.04em;color:#fff;margin-bottom:4px}
        .rest-desc{font-size:10px;color:rgba(255,255,255,0.3);line-height:1.6;margin-bottom:10px}
        .rest-footer{display:flex;align-items:center;justify-content:space-between;border-top:0.5px solid rgba(255,255,255,0.06);padding-top:10px}
        .rest-price{font-size:13px;color:#fff;font-weight:500}
        .rest-price span{font-size:9px;color:rgba(255,255,255,0.3);font-weight:400}
        .rest-book{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#FF6B00;border:0.5px solid rgba(255,107,0,0.35);padding:5px 10px;border-radius:2px;background:transparent;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .rest-book:hover{background:#FF6B00;color:#fff}

        /* EMPTY / LOADING */
        .empty-state{grid-column:1/-1;text-align:center;padding:60px 20px;color:rgba(255,255,255,0.2)}
        .empty-icon{font-size:48px;margin-bottom:16px}
        .empty-text{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:0.06em;margin-bottom:8px}
        .empty-sub{font-size:12px;color:rgba(255,255,255,0.15)}
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
      <nav>
        <a href="/" className="nav-logo">Xploura</a>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/trips">Trips</a></li>
          <li><a href="/dates">Dates</a></li>
          <li><a href="/cafes">Cafes</a></li>
          <li><a href="/restaurants" className="active">Restaurants</a></li>
          <li><a href="/adventure">Adventure</a></li>
          <li><a href="/ai-agent">X AI Agent</a></li>
        </ul>
        <div className="nav-right">
          <a href="/auth" className="nb">Sign In</a>
          <a href="/auth?tab=signup" className="nb fill">Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <div className="hero-breadcrumb">Home <span>/ Restaurants</span></div>
          <div className="hero-title">Top <span>Restaurants</span><br />in Pune</div>
          <div className="hero-meta"><b>{cards.length}</b> restaurants listed · Fine Dining · Casual · Rooftop</div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-section">
        <div className="search-bar">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurants, areas..." />
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
        <aside className="sidebar">
          <div className="sb-title">Cuisine</div>
          {['North Indian','South Indian','Chinese','Continental','Italian','Japanese','Fast Food','Seafood'].map(c => (
            <div key={c} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />{c}</div>
            </div>
          ))}

          <div className="sb-title">Area</div>
          {['Koregaon Park','Baner','Kalyani Nagar','Viman Nagar','Camp','FC Road'].map(a => (
            <div key={a} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />{a}</div>
            </div>
          ))}

          <div className="sb-title">Budget per Head</div>
          <div className="price-row"><span>₹200</span><span>₹5,000</span></div>
          <input type="range" className="slider" min={200} max={5000} defaultValue={1500} />

          <div className="sb-title">Rating</div>
          {['4.5+','4.0+','3.5+'].map(r => (
            <div key={r} className="sb-option">
              <div className="sb-opt-l"><div className="sb-check" />⭐ {r}</div>
            </div>
          ))}

          <button className="sb-apply">Apply Filters</button>
        </aside>

        <main className="main-content">
          <div className="content-header">
            <div className="results-count"><b>{displayed.length}</b> restaurants found</div>
          </div>

          <div className="cards-grid">
            {loading ? (
              <div className="loading-state">Loading restaurants...</div>
            ) : displayed.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <div className="empty-text">No Restaurants Found</div>
                <div className="empty-sub">Try a different search or check back later</div>
              </div>
            ) : displayed.map((d, i) => (
              <div key={i} className="rest-card" onClick={() => openBooking(d)}>
                <div className="rest-img">
                  {d.image_url && <img src={d.image_url} alt={d.name} />}
                  <div className="rest-tag-pill">{d.tag || `Restaurant · ${d.area}`}</div>
                  {d.rating && <div className="rest-rating">⭐ {d.rating}</div>}
                </div>
                <div className="rest-info">
                  <div className="rest-area">{d.area}</div>
                  <div className="rest-name">{d.name}</div>
                  <div className="rest-desc">{d.description || 'A wonderful dining experience awaits'}</div>
                  <div className="rest-footer">
                    <div className="rest-price">{d.price} <span>/head</span></div>
                    <button className="rest-book">Reserve →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* MOBILE NAV */}
      <div id="mobile-nav">
        <button className="mnav-btn" onClick={() => window.location.href='/'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </button>
        <button className="mnav-btn" style={{color:'#FF6B00'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2"/></svg>
          <span style={{color:'#FF6B00'}}>Restaurants</span>
        </button>
        <button className="mnav-btn" style={{marginTop:-20}} onClick={() => window.location.href='/ai-agent'}>
          <div className="mnav-ai-btn">X</div>
          <span>AI</span>
        </button>
        <button className="mnav-btn" onClick={() => window.location.href='/cafes'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>
          <span>Cafes</span>
        </button>
        <button className="mnav-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Profile</span>
        </button>
      </div>
    </>
  );
}