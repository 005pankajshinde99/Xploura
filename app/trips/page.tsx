'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';

const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

const FILTERS = [
  { l: 'All', v: '' },
  { l: 'Weekend Getaway', v: 'weekend' },
  { l: 'Adventure', v: 'adventure' },
  { l: 'International', v: 'international' },
  { l: 'Camping', v: 'camping' },
  { l: 'Road Trip', v: 'roadtrip' },
];

const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Distance', 'Rating'];

const FEATURED = [
  { label: 'TRENDING', title: 'Lonavala Weekend', sub: 'Waterfalls · Cafes · Hiking · 65km', price: '₹2,500', img: 'https://images.unsplash.com/photo-1670258896861-b77a8cf6075c?w=800&q=80', tag: 'ADVENTURE · 65KM', badge: '🔥 Hot', rating: '4.9' },
  { label: 'POPULAR', title: 'Pawna Lake Camp', sub: 'Stargazing · Bonfire · Kayaking · 80km', price: '₹1,800', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80', tag: 'CAMPING · 80KM', badge: '✨ New', rating: '4.8' },
  { label: 'HOT DEAL', title: 'Goa Weekend Escape', sub: 'Beach · Scooter · Shacks · 2N/3D', price: '₹6,800', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', tag: 'BEACH · GOA', badge: '💎 Premium', rating: '4.7' },
  { label: 'NEW', title: 'Mahabaleshwar Trip', sub: 'Strawberries · Sunrise · Lakes', price: '₹3,200', img: 'https://images.unsplash.com/photo-1595084305818-84c2daca7482?w=800&q=80', tag: 'HILLS · 120KM', badge: '⭐ Top Rated', rating: '4.9' },
];

export default function TripsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('Recommended');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    _supabase.from('cafes').select('*').eq('category', 'travel').then(({ data }) => setCards(data || []));
  }, []);

   const displayed = cards.filter(d =>
    (!search || d.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || d.tag?.toLowerCase().includes(filter))
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
      document.querySelectorAll('.trip-card').forEach(card => observer.observe(card));
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
        :root{--saffron:#FF6B00;--saffronL:#FF8C35;--black:#000;--white:#fff;--off:#FAFAF8}
        /* NAV */
        nav{position:fixed;top:0;left:0;right:0;padding:14px 48px;display:flex;align-items:center;justify-content:space-between;z-index:100;background:rgba(0,0,0,0.95);backdrop-filter:blur(20px);border-bottom:0.5px solid rgba(255,255,255,0.06)}
        .nav-logo{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:0.14em;color:#fff;text-decoration:none}
        .nav-links{display:flex;gap:28px;list-style:none}
        .nav-links a{font-size:11px;letter-spacing:0.13em;text-transform:uppercase;color:rgba(255,255,255,0.45);text-decoration:none;transition:color 0.3s}
        .nav-links a:hover,.nav-links a.active{color:#FF6B00}
        .nav-right{display:flex;gap:10px}
        .nb{font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border:0.5px solid rgba(255,255,255,0.15);padding:8px 18px;border-radius:24px;background:transparent;color:rgba(255,255,255,0.55);cursor:pointer;transition:all 0.3s;font-family:'DM Sans',sans-serif}
        .nb:hover{border-color:#fff;color:#fff}
        .nb.fill{background:#FF6B00;color:#fff;border-color:#FF6B00}
        .nb.fill:hover{background:#FF8C35}
        /* HERO */
        .trips-hero{position:relative;height:320px;display:flex;align-items:flex-end;overflow:hidden;background:#000}
        .trips-hero-bg{position:absolute;inset:-5%;background:url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80') center/cover;filter:grayscale(30%) brightness(0.38);z-index:0}
        .trips-hero-overlay{position:absolute;inset:0;background:linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%),linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%);z-index:1}
        .trips-hero-inner{position:relative;z-index:2;padding:40px 48px;width:100%}
        .hero-breadcrumb{font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:12px}
        .hero-breadcrumb span{color:#FF6B00}
        .hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,7vw,80px);line-height:0.88;letter-spacing:0.03em;margin-bottom:14px}
        .hero-title span{color:#FF6B00}
        .hero-meta{display:flex;align-items:center;gap:20px;font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.08em}
        .hero-meta b{color:rgba(255,255,255,0.7)}
        .hmeta-dot{width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,0.2)}
        /* SEARCH BAR */
        .search-section{background:#0a0a0a;border-bottom:0.5px solid rgba(255,255,255,0.06);padding:16px 48px}
        .search-bar{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);border-radius:6px;padding:12px 18px;transition:border-color 0.3s}
        .search-bar:focus-within{border-color:rgba(255,107,0,0.4)}
        .search-icon{color:rgba(255,255,255,0.25);flex-shrink:0}
        .search-bar input{flex:1;background:transparent;border:none;outline:none;color:#fff;font-size:13px;font-family:'DM Sans',sans-serif}
        .search-bar input::placeholder{color:rgba(255,255,255,0.2)}
        .search-divider{width:0.5px;height:20px;background:rgba(255,255,255,0.1)}
        .search-btn{background:#FF6B00;color:#fff;border:none;padding:8px 20px;border-radius:4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.3s;flex-shrink:0}
        .search-btn:hover{background:#FF8C35}
        /* FILTERS */
        .filters-bar{padding:12px 48px;border-bottom:0.5px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:10px;overflow-x:auto;scrollbar-width:none;background:#050505}
        .filters-bar::-webkit-scrollbar{display:none}
        .filter-chip{padding:6px 16px;border:0.5px solid rgba(255,255,255,0.1);border-radius:3px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.4);background:transparent;cursor:pointer;white-space:nowrap;transition:all 0.25s;font-family:'DM Sans',sans-serif}
        .filter-chip:hover{border-color:rgba(255,107,0,0.5);color:#FF6B00}
        .filter-chip.active{border-color:#FF6B00;color:#fff;background:#FF6B00}
        .filter-divider{width:0.5px;height:18px;background:rgba(255,255,255,0.08);flex-shrink:0}
        /* MAIN LAYOUT */
        .page-layout{display:grid;grid-template-columns:240px 1fr;gap:0;min-height:60vh}
        /* SIDEBAR */
        .sidebar{border-right:0.5px solid rgba(255,255,255,0.06);padding:28px 24px;position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto;scrollbar-width:none;background:#050505}
        .sidebar::-webkit-scrollbar{display:none}
        .sb-title{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:16px;margin-top:8px}
        .sb-title:first-child{margin-top:0}
        .sb-option{display:flex;align-items:center;justify-content:space-between;padding:8px 0;cursor:pointer;border-bottom:0.5px solid rgba(255,255,255,0.04)}
        .sb-option-l{display:flex;align-items:center;gap:10px;font-size:12px;color:rgba(255,255,255,0.45);transition:color 0.2s}
        .sb-option:hover .sb-option-l{color:rgba(255,255,255,0.8)}
        .sb-check{width:14px;height:14px;border:0.5px solid rgba(255,255,255,0.2);border-radius:2px;flex-shrink:0;transition:all 0.2s;display:flex;align-items:center;justify-content:center}
        .sb-check.checked{background:#FF6B00;border-color:#FF6B00}
        .sb-count{font-size:9px;color:rgba(255,255,255,0.2)}
        .price-slider{margin:12px 0}
        .price-row{display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:8px}
        .slider{width:100%;-webkit-appearance:none;height:1px;background:rgba(255,255,255,0.1);outline:none;border-radius:1px}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#FF6B00;cursor:pointer}
        .rating-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
        .rating-chip{padding:4px 10px;border:0.5px solid rgba(255,255,255,0.1);border-radius:2px;font-size:10px;color:rgba(255,255,255,0.4);cursor:pointer;transition:all 0.2s}
        .rating-chip:hover,.rating-chip.active{border-color:#FF6B00;color:#FF6B00}
        .sb-apply{width:100%;padding:10px;background:#FF6B00;color:#fff;border:none;border-radius:3px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;margin-top:20px;font-family:'DM Sans',sans-serif;transition:background 0.3s}
        .sb-apply:hover{background:#FF8C35}
        /* MAIN CONTENT */
        .main-content{padding:24px 32px}
        .content-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
        .results-count{font-size:12px;color:rgba(255,255,255,0.3)}
        .results-count b{color:rgba(255,255,255,0.7)}
        .sort-row{display:flex;align-items:center;gap:10px}
        .sort-label{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.25)}
        .sort-sel{background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);padding:7px 12px;border-radius:3px;font-size:11px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}
        .view-btns{display:flex;border:0.5px solid rgba(255,255,255,0.1);border-radius:3px;overflow:hidden}
        .view-btn{padding:7px 10px;background:transparent;border:none;color:rgba(255,255,255,0.3);cursor:pointer;transition:all 0.2s}
        .view-btn.active{background:rgba(255,107,0,0.15);color:#FF6B00}
        /* FEATURED SECTION */
        .section-title{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:14px}
        .featured-grid{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:auto auto;gap:10px;margin-bottom:28px}
        .feat-card{position:relative;border-radius:6px;overflow:hidden;cursor:pointer;background:#111}
        .feat-card:first-child{grid-row:span 2}
        .feat-card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.5s}
        .feat-card:hover .feat-card-img{transform:scale(1.05)}
        .feat-card-overlay{position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)}
        .feat-card-content{position:absolute;bottom:0;left:0;right:0;padding:14px}
        .feat-label{display:inline-block;font-size:8px;letter-spacing:0.15em;text-transform:uppercase;color:#FF6B00;border:0.5px solid rgba(255,107,0,0.4);padding:3px 8px;border-radius:2px;margin-bottom:6px}
        .feat-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(16px,2.5vw,26px);letter-spacing:0.04em;color:#fff;line-height:1}
        .feat-sub{font-size:10px;color:rgba(255,255,255,0.45);margin-top:4px}
        .feat-price{font-size:12px;color:#FF6B00;font-weight:500;margin-top:6px}
        .feat-badge{position:absolute;top:10px;right:10px;font-size:9px;background:rgba(0,0,0,0.7);border:0.5px solid rgba(255,255,255,0.15);padding:4px 8px;border-radius:2px;color:rgba(255,255,255,0.8);backdrop-filter:blur(8px)}
        /* GRID CARDS */
        .trips-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .trip-card{border-radius:6px;overflow:hidden;background:#0d0d0d;border:0.5px solid rgba(255,255,255,0.07);cursor:pointer;position:relative;opacity:0;transform:translateY(24px);transition:opacity 0.5s ease,transform 0.5s ease}
        .trip-card.visible{opacity:1;transform:translateY(0)}
        .trip-card:hover{border-color:rgba(255,107,0,0.4);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.4)}
        .trip-img-wrap{height:160px;overflow:hidden;position:relative}
        .trip-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s}
        .trip-card:hover .trip-img-wrap img{transform:scale(1.06)}
        .trip-img-wrap::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 100%);pointer-events:none;z-index:1}
        .trip-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s}
        .trip-card:hover .trip-img-wrap img{transform:scale(1.06)}
        .trip-badge{position:absolute;top:10px;left:10px;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;background:rgba(0,0,0,0.75);border:0.5px solid rgba(255,255,255,0.15);padding:4px 8px;border-radius:2px;color:rgba(255,255,255,0.7);backdrop-filter:blur(8px)}
        .trip-rating{position:absolute;top:10px;right:10px;font-size:9px;background:#FF6B00;padding:3px 8px;border-radius:2px;color:#fff;font-weight:500}
        .trip-info{padding:14px}
        .trip-tag{font-size:8px;letter-spacing:0.16em;text-transform:uppercase;color:#FF6B00;margin-bottom:5px}
        .trip-name{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:0.04em;color:#fff;line-height:1.1;margin-bottom:4px}
        .trip-sub{font-size:10px;color:rgba(255,255,255,0.3);line-height:1.6;margin-bottom:10px}
        .trip-footer{display:flex;align-items:center;justify-content:space-between;border-top:0.5px solid rgba(255,255,255,0.06);padding-top:10px}
        .trip-price{font-size:13px;color:#fff;font-weight:500}
        .trip-price span{font-size:9px;color:rgba(255,255,255,0.3);font-weight:400}
        .trip-book{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#FF6B00;border:0.5px solid rgba(255,107,0,0.35);padding:5px 10px;border-radius:2px;background:transparent;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .trip-book:hover{background:#FF6B00;color:#fff}
        /* LIST VIEW */
        .trip-list-card{display:flex;gap:0;border-radius:6px;overflow:hidden;background:#0d0d0d;border:0.5px solid rgba(255,255,255,0.07);cursor:pointer;transition:all 0.3s;margin-bottom:10px}
        .trip-list-card:hover{border-color:rgba(255,107,0,0.35);transform:translateX(4px)}
        .trip-list-img{width:180px;flex-shrink:0;overflow:hidden}
        .trip-list-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s}
        .trip-list-card:hover .trip-list-img img{transform:scale(1.04)}
        .trip-list-info{flex:1;padding:18px 20px;display:flex;flex-direction:column;justify-content:space-between}
        .trip-list-top{display:flex;align-items:flex-start;justify-content:space-between}
        .trip-list-actions{display:flex;gap:8px;align-items:center;margin-top:12px}
        /* MOBILE NAV */
        #mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;height:64px;background:#000;border-top:0.5px solid rgba(255,255,255,0.08);z-index:999;align-items:center;justify-content:space-around;padding:0 8px}
        .mnav-btn{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 12px;color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif}
        .mnav-btn span{font-size:9px;letter-spacing:0.06em;text-transform:uppercase}
        .mnav-ai-btn{width:52px;height:52px;border-radius:50%;background:#FF6B00;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(255,107,0,0.5);border:3px solid #000;font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff}
        @media(max-width:1024px){
          nav ul{display:none!important}
          .nav-right a:first-child{display:none}
          #mobile-nav{display:flex!important}
          .page-layout{grid-template-columns:1fr}
          .sidebar{display:none}
          .trips-hero-inner{padding:24px 16px}
          .featured-grid{grid-template-columns:1fr!important;grid-template-rows:auto}
          .feat-card:first-child{grid-row:span 1}
          .filters-bar{padding:10px 16px}
          .search-section{padding:12px 16px}
          .main-content{padding:16px}
          .trips-grid{grid-template-columns:1fr!important}
          .trip-list-card{flex-direction:column}
          .trip-list-img{width:100%;height:160px}
        }
      `}</style>

      {/* NAV */}
      <Navbar active="trips" />

      {/* HERO */}
      <div className="trips-hero" style={{ height: 280 }}>
        <div className="trips-hero-bg" />
        <div className="trips-hero-overlay" />
        <div className="trips-hero-inner">
          <div className="hero-breadcrumb">Home <span>/ Trips</span></div>
          <div className="hero-title">Escape &amp; <span>Explore</span></div>
          <div className="hero-meta">
            <span><b>240+</b> Destinations</span>
            <div className="hmeta-dot" />
            <span><b>₹999</b> starting from</span>
            <div className="hmeta-dot" />
            <span>Weekend · Long Weekends · Custom</span>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-section">
        <div className="search-bar">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations, trips, experiences..." />
          <div className="search-divider" />
          <button className="search-btn">Search →</button>
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div className="filters-bar">
        {FILTERS.map(f => (
          <button key={f.v} className={`filter-chip${filter === f.v ? ' active' : ''}`} onClick={() => setFilter(f.v)}>{f.l}</button>
        ))}
        <div className="filter-divider" />
        <button className="filter-chip" onClick={() => setShowFilters(!showFilters)}>⚙ Filters</button>
      </div>

      {/* LAYOUT */}
      <div className="page-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-title">Category</div>
          {['Weekend Getaway', 'Adventure Trip', 'International', 'Camping', 'Road Trip', 'Honeymoon'].map(c => (
            <div key={c} className="sb-option">
              <div className="sb-option-l">
                <div className="sb-check" />{c}
              </div>
              <div className="sb-count"></div>
            </div>
          ))}

          <div className="sb-title" style={{ marginTop: 24 }}>Price Range</div>
          <div className="price-slider">
            <div className="price-row"><span>₹999</span><span>₹{priceRange[1].toLocaleString()}</span></div>
            <input type="range" className="slider" min={999} max={15000} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} />
          </div>

          <div className="sb-title" style={{ marginTop: 16 }}>Duration</div>
          {['Day Trip', '1 Night / 2 Days', '2 Nights / 3 Days', '3+ Nights'].map(d => (
            <div key={d} className="sb-option">
              <div className="sb-option-l"><div className="sb-check" />{d}</div>
            </div>
          ))}

          <div className="sb-title" style={{ marginTop: 24 }}>Rating</div>
          <div className="rating-row">
            {['4.5+', '4.0+', '3.5+'].map(r => (
              <button key={r} className="rating-chip">⭐ {r}</button>
            ))}
          </div>

          <div className="sb-title" style={{ marginTop: 24 }}>Distance</div>
          {['< 50 km', '50–100 km', '100–300 km', '300 km+'].map(d => (
            <div key={d} className="sb-option">
              <div className="sb-option-l"><div className="sb-check" />{d}</div>
            </div>
          ))}

          <button className="sb-apply">Apply Filters</button>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {/* Featured */}
          <div className="section-title">Featured Trips</div>
          <div className="featured-grid">
            {FEATURED.map((f, i) => (
              <div key={i} className="feat-card" style={{ height: i === 0 ? 340 : 160 }}>
                <img className="feat-card-img" src={f.img} alt={f.title} style={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }} />
                <div className="feat-card-overlay" />
                <div className="feat-card-content">
                  <div className="feat-label">{f.label}</div>
                  <div className="feat-title">{f.title}</div>
                  {i === 0 && <div className="feat-sub">{f.sub}</div>}
                  <div className="feat-price">From {f.price}/person</div>
                </div>
                <div className="feat-badge">{f.badge}</div>
              </div>
            ))}
          </div>

          {/* All Trips */}
          <div className="content-header">
            <div className="results-count"><b>{displayed.length || FEATURED.length}</b> trips found</div>
            <div className="sort-row">
              <span className="sort-label">Sort:</span>
              <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <div className="view-btns">
                <button className={`view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </button>
                <button className={`view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Cards */}
          {displayed.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="trips-grid">
                {displayed.map((d, i) => (
                  <div key={i} className="trip-card" onClick={() => openBooking(d)}>
                    <div className="trip-img-wrap">
                      {d.image_url && <img src={d.image_url} alt={d.name} />}
                      <div className="trip-badge">{d.tag || `${d.category} · ${d.area}`}</div>
                      <div className="trip-rating">⭐ {d.rating}</div>
                    </div>
                    <div className="trip-info">
                      <div className="trip-tag">{d.category} · {d.area}</div>
                      <div className="trip-name">{d.name}</div>
                      <div className="trip-sub">{d.description || 'Amazing experience awaits you'}</div>
                      <div className="trip-footer">
                        <div className="trip-price">{d.price} <span>/person</span></div>
                        <button className="trip-book">Book Now →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {displayed.map((d, i) => (
                  <div key={i} className="trip-list-card" onClick={() => openBooking(d)}>
                    <div className="trip-list-img">
                      {d.image_url && <img src={d.image_url} alt={d.name} />}
                    </div>
                    <div className="trip-list-info">
                      <div className="trip-list-top">
                        <div>
                          <div className="trip-tag">{d.category} · {d.area}</div>
                          <div className="trip-name" style={{ fontSize: 22 }}>{d.name}</div>
                          <div className="trip-sub">{d.description || 'Amazing experience awaits'}</div>
                        </div>
                        <div className="trip-rating" style={{ position: 'static', fontSize: 11 }}>⭐ {d.rating}</div>
                      </div>
                      <div className="trip-list-actions">
                        <div className="trip-price">{d.price} <span>/person</span></div>
                        <button className="trip-book" style={{ marginLeft: 'auto' }}>Book Now →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Fallback: show featured as regular cards */
            <div className="trips-grid">
              {FEATURED.map((f, i) => (
                <div key={i} className="trip-card">
                  <div className="trip-img-wrap">
                    <img src={f.img} alt={f.title} />
                    <div className="trip-badge">{f.tag}</div>
                    <div className="trip-rating">⭐ {f.rating}</div>
                  </div>
                  <div className="trip-info">
                    <div className="trip-tag">{f.tag}</div>
                    <div className="trip-name">{f.title}</div>
                    <div className="trip-sub">{f.sub}</div>
                    <div className="trip-footer">
                      <div className="trip-price">{f.price} <span>/person</span></div>
                      <button className="trip-book">Book Now →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE NAV */}
      <div id="mobile-nav">
        <button className="mnav-btn" onClick={() => window.location.href = '/'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </button>
        <button className="mnav-btn" style={{ color: '#FF6B00' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 17l4-8 4 4 3-6 4 8"/></svg>
          <span style={{ color: '#FF6B00' }}>Trips</span>
        </button>
        <button className="mnav-btn" style={{ marginTop: -20 }} onClick={() => window.location.href = '/ai-agent'}>
          <div className="mnav-ai-btn">X</div>
          <span>AI</span>
        </button>
        <button className="mnav-btn" onClick={() => window.location.href = '/cafes'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          <span>Cafes</span>
        </button>
        <button className="mnav-btn" onClick={() => window.location.href = '/admin'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Profile</span>
        </button>
      </div>
    </>
  );
}