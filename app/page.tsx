'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from './components/Navbar';

import { motion } from 'motion/react';
import { FaUtensils, FaCompass, FaCoffee, FaHeart, FaMountain, FaFire } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';


const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

function CategoryRow({ label, icon, cat, supabase, catMap, onBook }: any) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('cafes')
      .select('*')
      .eq('category', catMap[cat] || cat)
      .order('area', { ascending: true })
      .then(({ data }: any) => setItems(data || []));
  }, [cat]);

  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: 52 }}>
      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'rgba(255,107,0,0.12)',
          border: '1px solid rgba(255,107,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {cat === 'shows' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>}
          {cat === 'travel' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>}
          {cat === 'sports' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><polygon points="3 17 12 3 21 17"/><line x1="3" y1="17" x2="21" y2="17"/></svg>}
          {cat === 'cafes' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>}
          {cat === 'restaurants' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>}
        </div>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111', margin: 0, lineHeight: 1 }}>{label}</h2>
        <div style={{ fontSize: 10, color: 'rgba(255,107,0,0.7)', fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.06em', border: '0.5px solid rgba(255,107,0,0.25)', padding: '3px 10px', borderRadius: 20 }}>{items.length} places</div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', letterSpacing: '0.06em' }}>View all →</div>
      </div>

      {/* Horizontal scroll cards */}
      <div style={{
        display: 'flex', gap: 16,
        overflowX: 'auto', scrollbarWidth: 'none',
        paddingBottom: 8,
        marginLeft: -4, paddingLeft: 4,
      }}>
        {items.map((d: any, i: number) => (
          <div
            key={i}
            onClick={() => onBook(d)}
            className="card"
            style={{
              flexShrink: 0,
              width: 220, borderRadius: 14,
              overflow: 'hidden',
              background: '#1a1714',
              border: '0.5px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              transition: 'all 0.22s',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLDivElement).style.border = '0.5px solid rgba(255,107,0,0.4)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLDivElement).style.border = '0.5px solid rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            {/* Image */}
            <div style={{ width: '100%', height: 160, position: 'relative', overflow: 'hidden' }}>
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '60%', zIndex: 1,
    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
    pointerEvents: 'none',
  }} />
              {d.image_url
                ? <img src={d.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', background: 'rgba(255,107,0,0.06)' }} />
              }
              {/* Rating */}
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(0,0,0,0.6)', borderRadius: 20,
                padding: '3px 8px', fontSize: 10, color: '#fff',
                fontFamily: "'DM Sans',sans-serif",
              }}>⭐ {d.rating}</div>
            </div>

            {/* Info */}
            <div style={{ padding: '12px 14px' }}>
              <div style={{
                fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#FF6B00', fontFamily: "'DM Sans',sans-serif", marginBottom: 5,
              }}>{d.tag || `${d.category} · ${d.area}`}</div>
              <div style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 19,
                color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: 6,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{d.name}</div>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.32)',
                fontFamily: "'DM Sans',sans-serif",
              }}>{d.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 0.5, background: 'rgba(255,255,255,0.06)', marginTop: 8 }} />
    </div>
  );
}
export default function Home() {
  const [cards, setCards] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState('travel');
  const [searchVal, setSearchVal] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState([
    { type: 'ai', text: "Hey! Tell me your budget and who you're going with — I'll plan the perfect experience for you." }
  ]);
  const [tickerText, setTickerText] = useState('Riya just booked Pagdandi · 2 min ago');
  const [loadPct, setLoadPct] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [curPos, setCurPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [slideIdx, setSlideIdx] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userStats, setUserStats] = useState({ trips: 0, reservations: 0, savedCafes: 0 });
const [userProfile, setUserProfile] = useState<any>(null);

  const [guestSheetOpen, setGuestSheetOpen] = useState(false);
  const [chatTyping, setChatTyping] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [featuredPlaces, setFeaturedPlaces] = useState<any[]>([]);
const [featuredIdx, setFeaturedIdx] = useState(0);
  const ringRef = useRef({ x: 0, y: 0 });
  const curRef = useRef({ x: 0, y: 0 });
  const hbgRef = useRef<HTMLDivElement>(null);
  const bgTarget = useRef({ x: 0, y: 0 });
  const bgCur = useRef({ x: 0, y: 0 });

  const tickers = [
    'Riya just booked Pagdandi · 2 min ago',
    'Arjun planned Lonavala trip · 5 min ago',
    '1,240 people exploring Pune tonight',
    'Sneha found a date spot · just now',
    
  ];

  const catMap: any = { travel: 'travel', shows: 'date', sports: 'adventure', cafes: 'cafe', restaurants: 'restaurant' };

  // LOADING
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += 2 + Math.random() * 5;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setLoaded(true), 300); }
      setLoadPct(Math.round(p));
    }, 40);
    return () => clearInterval(iv);
  }, []);

  // FEATURED FETCH
useEffect(() => {
  const categories = ['date', 'cafe', 'adventure'];
  Promise.all(
    categories.map(cat =>
      _supabase.from('cafes')
        .select('*')
        .eq('featured', true)
        .eq('category', cat)
        .limit(1)
        .single()
        .then(({ data }) => data)
    )
  ).then(results => setFeaturedPlaces(results.filter(Boolean)));
}, []);

// FEATURED AUTO SLIDE
useEffect(() => {
  if (featuredPlaces.length <= 1) return;
  const t = setInterval(() => {
    setFeaturedIdx(p => (p + 1) % featuredPlaces.length);
  }, 2800);
  return () => clearInterval(t);
}, [featuredPlaces]);

useEffect(() => {
  _supabase.auth.getSession().then(({ data }) => {
    setUser(data.session?.user ?? null);
    setAuthLoading(false);
  });
  const { data: listener } = _supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    setAuthLoading(false);
  });
  return () => listener.subscription.unsubscribe();
}, []);

useEffect(() => {
  if (!user) { setUserStats({ trips: 0, reservations: 0, savedCafes: 0 }); return; }

  async function loadStats() {
    const [{ count: all }, { count: trips }, { count: saved }] = await Promise.all([
      _supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      _supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('category', ['travel','trip','adventure']),
      _supabase.from('saved_places').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);
    setUserStats({ trips: trips ?? 0, reservations: (all ?? 0) - (trips ?? 0), savedCafes: saved ?? 0 });
  }

  _supabase.from('profiles').select('*').eq('id', user.id).single()
    .then(({ data }) => { if (data) setUserProfile(data); });

  loadStats().catch(() => {});
}, [user]);

  // CURSOR
  useEffect(() => {
    const move = (e: MouseEvent) => { curRef.current = { x: e.clientX, y: e.clientY }; bgTarget.current = { x: (e.clientX / window.innerWidth - 0.5) * 18, y: (e.clientY / window.innerHeight - 0.5) * 10 }; };
    window.addEventListener('mousemove', move);
    let raf: number;
    const loop = () => {
      ringRef.current.x += (curRef.current.x - ringRef.current.x) * 0.13;
      ringRef.current.y += (curRef.current.y - ringRef.current.y) * 0.13;
      setCurPos({ ...curRef.current });
      setRingPos({ ...ringRef.current });
      bgCur.current.x += (bgTarget.current.x - bgCur.current.x) * 0.055;
      bgCur.current.y += (bgTarget.current.y - bgCur.current.y) * 0.055;
      if (hbgRef.current) hbgRef.current.style.transform = `translate(${bgCur.current.x}px,${bgCur.current.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  // TICKER
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % tickers.length; setTickerText(tickers[i]); }, 3200);
    return () => clearInterval(t);
  }, []);

  // ← YE NAYA useEffect YAHAN ADD KARO ↓
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth <= 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

  // SLIDE
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(p => (p + 1) % 4), 3500);
    return () => clearInterval(t);
  }, []);



  // CARDS
  useEffect(() => { buildCards(activeCat); }, [activeCat]);

  


// Card scroll fade observer
useEffect(() => {
  const cards = document.querySelectorAll('.card');
  
  // Pehle sab cards ko reset karo
  cards.forEach((card) => {
    card.classList.remove('visible');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Observe karte raho — unobserve mat karo
        } else {
          // Jab card screen se bahar jaye toh remove karo
          entry.target.classList.remove('visible');
        }
      });
    },
    { threshold: 0.08 }
  );

  const timer = setTimeout(() => {
    document.querySelectorAll('.card').forEach((card) => {
      observer.observe(card);
    });
  }, 100);

  return () => {
    clearTimeout(timer);
    observer.disconnect();
  };
}, [cards]);


  async function buildCards(cat: string) {
    const { data } = await _supabase.from('cafes').select('*').eq('category', catMap[cat] || cat).order('area', { ascending: true });
    setCards(data || []);
  }

  function openBooking(d: any) {
    window.location.href = `/booking?data=${encodeURIComponent(JSON.stringify(d))}`;
  }

async function sendChat(overrideText?: string) {
  const txt = (overrideText ?? chatInput).trim();
  if (!txt || chatTyping) return;
  setChatInput('');
  setChatMsgs(prev => [...prev, { type: 'user', text: txt }]);
  setChatTyping(true);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: `You are Xploura AI — a super friendly local guide for Pune, India. Talk like a knowledgeable friend. Keep replies under 80 words. Use 1-2 emojis max. Be specific about places, prices, what to order. Never say "Certainly!" or "Of course!". Vary your openings every time.` },
          ...chatMsgs.slice(-6).map(m => ({ role: m.type === 'ai' ? 'assistant' : 'user', content: m.text })),
          { role: 'user', content: txt }
        ],
        max_tokens: 200,
        temperature: 0.9,
      }),
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (reply) {
      setChatMsgs(prev => [...prev, { type: 'ai', text: reply }]);
      setChatTyping(false);
      return;
    }
  } catch {}

  // Fallback
  const lower = txt.toLowerCase();
  const fallback = lower.includes('mumbai') || lower.includes('trip')
    ? '3D/2N from ₹8,500 — Gateway of India, Marine Drive, street food tour. Book it? 🧡'
    : lower.includes('ipl') ? 'MI vs CSK at Wankhede — ₹1,200 to ₹8,500. Check availability?'
    : lower.includes('cafe') ? 'Pagdandi (Baner), The Flour Works (KP), Vohuman (Camp) — all absolute must-visits ☕'
    : lower.includes('goa') ? 'Calangute resort + scooter + beach shacks — ₹6,800/person. This weekend? 🏖️'
    : 'I know Pune inside out — cafes, dates, trips, adventure! What are you planning? 🧡';
  setChatMsgs(prev => [...prev, { type: 'ai', text: fallback }]);
  setChatTyping(false);
}

  const filteredCards = cards.filter(d => !searchVal || d.name?.toLowerCase().includes(searchVal.toLowerCase()) || d.tag?.toLowerCase().includes(searchVal.toLowerCase()));

  const slides = [
  { label: 'TRENDING', title: 'Paasha Rooftop — Date Night Special', sub: 'Koregaon Park · ₹2,500/head · 4.9★', btn: 'Reserve Now →', bg: 'url(https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80)' },
  { label: 'POPULAR', title: 'Pagdandi Books — Cozy Cafe Vibes', sub: 'Baner · ₹300/head · Perfect for work & dates', btn: 'Explore →', bg: 'url(https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80)' },
  { label: 'HOT NOW', title: 'Go Karting Pune — Thrilling Experience', sub: 'Adventure · Pune · From ₹800/person', btn: 'Book Now →', bg: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80)' },
  { label: 'NEW', title: 'Plan Your Perfect Night with X AI', sub: 'Tell us your budget — we plan everything', btn: 'Try X AI →', bg: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80)' },
];

  return (
    <>
      {/* CURSOR */}
      <div id="cursor" style={{ left: curPos.x, top: curPos.y }} />
      <div id="cursor-ring" style={{ left: ringPos.x, top: ringPos.y }} />

      {/* LOADING */}
      <div id="loading" className={loaded ? 'hidden' : ''}>
        <div className="ll">Xploura</div>
        <div className="lb"><div className="lf" style={{ width: `${loadPct}%` }} /></div>
        <div className="lp">{loadPct}%</div>
      </div>

{/* NAV */}
<Navbar active="home" />
      {/* HERO */}
      <section id="hero">
        <div className="hbg" ref={hbgRef} />
        <div className="hbg-overlay" />
        <div className="hbg-overlay-tb" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge"><div className="hbdot" />Pune's Date & Experience Planner</div>
            <h1 className="hero-h1" style={isMobile ? {display:'flex', alignItems:'center', justifyContent:'space-between', gap:12} : {}}>
  <div>
     <span className="hs1">Plan</span>
    <span className="hs2">Your</span>
    <span className="hs3">Story</span>
  </div>

  {/* Featured Card — Mobile Only */}
{isMobile && featuredPlaces.length > 0 && (
  <div style={{flexShrink:0, width:155}}>

    {/* Header */}
    <div style={{display:'flex', alignItems:'center', gap:5, marginBottom:7}}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="#FF6B00">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <span style={{fontSize:8, color:'#FF6B00', letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:700, fontFamily:"'DM Sans',sans-serif"}}>Featured</span>
      <div style={{
        width:5, height:5, borderRadius:'50%',
        background:'#FF6B00',
        marginLeft:2,
        animation:'featPulse 1.8s ease-in-out infinite',
      }}/>
    </div>

    {/* Card — Square */}
    <div style={{
      width:155, height:145,
borderRadius:13, overflow:'hidden',
      position:'relative',
      border:'0.5px solid rgba(255,107,0,0.3)',
      cursor:'pointer',
    }}
    onClick={() => openBooking(featuredPlaces[featuredIdx])}
    >
      {/* Slide track */}
      <div style={{
        display:'flex',
        width:`${featuredPlaces.length * 155}px`,
        height:'145px',
        transform:`translateX(-${featuredIdx * 155}px)`,
        transition:'transform 0.55s cubic-bezier(0.77,0,0.18,1)',
        willChange:'transform',
      }}>
        {featuredPlaces.map((f, i) => (
          <div key={i} style={{
            width:155, height:145,
            flexShrink:0,
            position:'relative',
            backgroundImage:`url('${f.image_url}')`,
            backgroundSize:'cover',
            backgroundPosition:'center',
          }}>
            {/* Gradient */}
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.22) 100%)',
            }}/>

            {/* Top row */}
            <div style={{
              position:'absolute', top:7, left:7, right:7,
              display:'flex', alignItems:'center', justifyContent:'space-between',
            }}>
              <div style={{
                background:'rgba(255,107,0,0.95)',
                borderRadius:20, padding:'3px 7px',
                display:'flex', alignItems:'center', gap:3,
              }}>
                {f.category === 'cafe' && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>}
                {f.category === 'restaurant' && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/></svg>}
                {f.category === 'adventure' && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><polygon points="3 17 12 3 21 17"/></svg>}
                {f.category === 'date' && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>}
                {f.category === 'travel' && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>}
                <span style={{fontSize:7, color:'#fff', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif"}}>{f.category}</span>
              </div>
              {f.rating && (
                <div style={{background:'rgba(0,0,0,0.65)', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'2px 6px', display:'flex', alignItems:'center', gap:3}}>
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="#FFB800"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{fontSize:8, color:'#fff', fontFamily:"'DM Sans',sans-serif"}}>{f.rating}</span>
                </div>
              )}
            </div>

            {/* Bottom info */}
            <div style={{position:'absolute', bottom:22, left:8, right:8}}>
              <div style={{fontSize:7, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,107,0,0.9)', fontFamily:"'DM Sans',sans-serif", marginBottom:2}}>{f.area}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:'#fff', letterSpacing:'0.04em', lineHeight:1.1, textShadow:'0 1px 8px rgba(0,0,0,0.7)'}}>{f.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Book button */}
      <div style={{
        position:'absolute', bottom:8, right:7,
        background:'#FF6B00', borderRadius:20,
        padding:'3px 9px', zIndex:10,
        display:'flex', alignItems:'center', gap:3,
      }}>
        <span style={{fontSize:7, fontWeight:700, color:'#fff', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif"}}>Book</span>
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>

      {/* Dots */}
      {featuredPlaces.length > 1 && (
        <div style={{position:'absolute', bottom:11, left:8, display:'flex', gap:3, alignItems:'center', zIndex:10}}>
          {featuredPlaces.map((_, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); setFeaturedIdx(i); }} style={{
              width: i === featuredIdx ? 14 : 4,
              height:3, borderRadius:2,
              background: i === featuredIdx ? '#FF6B00' : 'rgba(255,255,255,0.28)',
              transition:'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              cursor:'pointer',
            }}/>
          ))}
        </div>
      )}
    </div>
  </div>
)}
</h1>
            <p className="hero-sub">Tell us your vibe, we'll plan the rest.<br />Dates · Team Outings · Cafes · Adventure</p>
            <div className="hero-cta-row">
              <button className="hbtn-primary" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>Plan My Night →</button>
              <button className="hbtn-ghost" onClick={() => document.getElementById('ai-section')?.scrollIntoView({ behavior: 'smooth' })}>Meet X AI</button>
            </div>

            {!isMobile && (
  <div style={{ 
  display: 'flex', gap: 8, 
  flexWrap: 'wrap', 
  marginTop: 16, marginBottom: 8, 
  maxWidth: '100%',
  overflowX: 'auto',
  scrollbarWidth: 'none' as const,
}}>
    {[
      { label: 'Romantic', href: '/dates', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF6B00" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
      { label: 'Adventure', href: '/adventure', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="3 17 12 3 21 17"/><line x1="3" y1="17" x2="21" y2="17"/></svg> },
      { label: 'Chill Cafe', href: '/cafes', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
      { label: 'Friends', href: '/restaurants', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    ].map(({ label, icon, href }) => (
      <a key={label} href={href} style={{
  flexShrink: 0,
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 999,
        border: '0.5px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.65)',
        fontSize: 11, letterSpacing: '0.08em',
        textTransform: 'uppercase', textDecoration: 'none',
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = '#FF6B00';
        (e.currentTarget as HTMLAnchorElement).style.color = '#FF6B00';
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,107,0,0.08)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)';
        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
      }}
      >
        {icon}{label}
      </a>
    ))}
  </div>
)}
            <div className="hero-ticker">
              <div className="htick-dot" />
              <div className="htick-text">{tickerText}</div>
            </div>
          </div>

          {/* MOBILE ONLY — category blocks */}
         {isMobile && (
  <div style={{
    width: '100vw',
    marginLeft: 'calc(-14px)',
    paddingLeft: 14,
    paddingRight: 14,
    boxSizing: 'border-box',
    marginTop: 14,
  }}>

    {/* Search bar */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 28, padding: '10px 16px',
      marginBottom: 16, width: '100%',
      boxSizing: 'border-box',
      fontSize: 13, color: 'rgba(255,255,255,0.35)',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      Dates, cafes, adventure...
    </div>

    {/* Mood selector — mobile */}
<div style={{
  display: 'flex', gap: 8,
  overflowX: 'auto', scrollbarWidth: 'none' as const,
  paddingBottom: 4, marginBottom: 16,
}}>
  {[
    { label: 'Romantic', href: '/dates', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF6B00" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
    { label: 'Adventure', href: '/adventure', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="3 17 12 3 21 17"/><line x1="3" y1="17" x2="21" y2="17"/></svg> },
    { label: 'Chill Cafe', href: '/cafes', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
    { label: 'Friends', href: '/restaurants', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  ].map(({ label, icon, href }) => (
    <a key={label} href={href} style={{
      flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 14px', borderRadius: 999,
      border: '0.5px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.65)',
      fontSize: 11, letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      textDecoration: 'none',
      fontFamily: "'DM Sans', sans-serif",
      whiteSpace: 'nowrap' as const,
    }}>
      {icon}{label}
    </a>
  ))}
</div>

    {/* Category blocks — 2 rows x 3 cols grid */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 10,
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: 20,
    }}>
      {[
       { label: 'X AI\nAgent', icon: <RiRobot2Fill size={20} />, id: 'ai', ai: true },
{ label: 'Dates',       icon: <FaHeart size={18} />,      id: 'dates' },
{ label: 'Cafes',       icon: <FaCoffee size={18} />,     id: 'cafes' },
{ label: 'Restaurants', icon: <FaUtensils size={16} />,   id: 'restaurants' },
{ label: 'Adventure',   icon: <FaMountain size={18} />,   id: 'adventure' },
{ label: 'Vibes',       icon: <FaFire size={18} />,       id: 'vibes' },  // ← YE
{ label: 'Trips',       icon: <FaCompass size={18} />,    id: 'trips' },
      ].map(cat => (
        <div
          key={cat.id}
         onClick={() => {
  if (cat.ai) { window.location.href = '/ai-agent'; return; }
  const routeMap: any = {
    dates: '/dates',
    cafes: '/cafes',
    restaurants: '/restaurants',
    adventure: '/adventure',
    vibes: '/vibes',
    trips: '/trips',
  };
  if (routeMap[cat.id]) {
    window.location.href = routeMap[cat.id];
  } else {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  }
}}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 5, height: 68,
            borderRadius: 12, cursor: 'pointer',
            border: cat.ai ? '1px solid #FF6B00' : '1px solid rgba(255,255,255,0.1)',
            background: cat.ai ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {cat.ai && (
            <div style={{
              position: 'absolute', top: -5, right: -5,
              width: 15, height: 15,
              background: '#FF6B00', borderRadius: '50%',
              border: '1.5px solid #0f0d0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 7, fontWeight: 700, color: '#fff'
            }}>X</div>
          )}
          <div style={{ color: cat.ai ? '#FF6B00' : 'rgba(255,255,255,0.65)' }}>
            {cat.icon}
          </div>
          <span style={{
            fontSize: 9, letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: cat.ai ? '#FF6B00' : 'rgba(255,255,255,0.45)',
            textAlign: 'center', lineHeight: 1.2,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'pre-line'
          }}>{cat.label}</span>
        </div>
      ))}
    </div>

    {/* Trending label */}
    <div style={{
      fontSize: 8.5, letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.28)',
      fontFamily: "'DM Sans', sans-serif",
      marginBottom: 12,
    }}>Trending Near You</div>

    {/* Trending mini cards — horizontal scroll */}
    <div style={{
      display: 'flex', gap: 10,
      overflowX: 'auto', scrollbarWidth: 'none',
      paddingBottom: 4,
      width: '100%',
      marginLeft: -14,
      paddingLeft: 14,
      paddingRight: 14,
      boxSizing: 'content-box',
    }}>
      {[
        { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', badge: '4.9 ★', tag: 'Adventure · 65km', name: 'LONAVALA', price: 'From ₹2,500' },
        { img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', badge: 'New', tag: 'Date Night', name: 'PAASHA ROOFTOP', price: '₹2,500/head', hot: true },
        { img: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&q=80', badge: '⛺ New', tag: 'Camping · 80km', name: 'PAWNA LAKE', price: 'From ₹1,800' },
      ].map((c, i) => (
        <div key={i} style={{
          flexShrink: 0, width: '42vw', maxWidth: 160, height: 178,
          borderRadius: 12, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#1a1714', position: 'relative', cursor: 'pointer'
        }}>
          <div style={{
            width: '100%', height: '60%',
            backgroundImage: `url('${c.img}')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'grayscale(50%) brightness(0.75)'
          }} />
          <div style={{
            position: 'absolute', top: 8, right: 8,
            fontSize: 8, fontWeight: 600, padding: '3px 7px',
            background: c.hot ? 'rgba(255,107,0,0.85)' : 'rgba(0,0,0,0.6)',
            border: c.hot ? 'none' : '0.5px solid rgba(255,255,255,0.15)',
            borderRadius: 8, color: '#fff',
            fontFamily: "'DM Sans', sans-serif"
          }}>{c.badge}</div>
          <div style={{ padding: '9px 10px' }}>
            <div style={{ fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FF6B00', fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{c.tag}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, color: '#fff', letterSpacing: '0.05em' }}>{c.name}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{c.price}</div>
          </div>
        </div>
      ))}
    </div>

  </div>
)}
          <div className="hero-right">
            <div className="cards-stage">
              <div className="stage-dot" style={{ width: 4, height: 4, top: '15%', left: '48%', opacity: 0.6 }} />
              <div className="stage-dot" style={{ width: 3, height: 3, top: '55%', left: '52%', opacity: 0.4 }} />
              <div className="stage-dot" style={{ width: 5, height: 5, top: '78%', left: '44%', opacity: 0.3 }} />
              {/* Featured */}
              <div className="hcard hcard-featured" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>
               <div className="hcard-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80')" }} />
  <div className="hcard-badge">💑 Hot</div>
  <div className="hcard-body">
    <div className="hcard-tag">Date Night · KP</div>
    <div className="hcard-name">Paasha Rooftop</div>
    <div className="hcard-price">₹2,500/head · 4.9★</div>
  </div>
</div>
              {/* T1 */}
              <div className="hcard hcard-t1">
  <div className="hcard-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80')" }} />
  <div className="hcard-badge">☕ Cozy</div>
  <div className="hcard-body">
    <div className="hcard-tag">Cafe · Baner</div>
    <div className="hcard-name">Pagdandi Books</div>
    <div className="hcard-price">₹300/head</div>
  </div>
</div>
              {/* T2 */}
             <div className="hcard hcard-t2">
  <div className="hcard-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80')" }} />
  <div className="hcard-badge">🏎️ Thrilling</div>
  <div className="hcard-body">
    <div className="hcard-tag">Adventure · Pune</div>
    <div className="hcard-name">Go Karting</div>
    <div className="hcard-price">From ₹800</div>
  </div>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div id="stats">
        {/* LIVE SLIDER */}
        <div style={{ position: 'relative', width: '100vw', height: 150, overflow: 'hidden', marginLeft: 'calc(-50vw + 50%)', boxSizing: 'border-box' }}>
          {slides.map((s, i) => (
            <div key={i} className="lslide" style={{ opacity: i === slideIdx ? 1 : 0, background: `linear-gradient(90deg,rgba(0,0,0,0.85) 30%,rgba(0,0,0,0.3) 100%),${s.bg} center/cover`, width: '100%', boxSizing: 'border-box', padding: '0 16px' }}>
              <div style={{ background: '#FF6B00', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'liveBlink 1.2s infinite' }} />{s.label}
              </div>
              <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: '#fff', letterSpacing: '0.06em', lineHeight: 1 }}>{s.title}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,107,0,0.85)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{s.sub}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(255,107,0,0.15)', border: '0.5px solid rgba(255,107,0,0.4)', color: '#FF6B00', padding: '7px 18px', borderRadius: 2, cursor: 'pointer', whiteSpace: 'nowrap' }}>{s.btn}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 10 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: i === slideIdx ? 16 : 6, height: 3, borderRadius: 2, background: i === slideIdx ? '#FF6B00' : 'rgba(255,255,255,0.25)', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
        {/* NUMBERS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderLeft: '0.5px solid rgba(255,255,255,0.06)' }}>
          {[ {n:'50',s:'+',l:'Curated spots in Pune'},
  {n:'4',s:'',l:'Experience categories'},
  {n:'AI',s:'',l:'Powered planning'},
  {n:'Free',s:'',l:'To get started'}].map((s,i) => (
            <div key={i} className="stat"><div className="stn"><span>{s.n}</span>{s.s}</div><div className="stl">{s.l}</div></div>
          ))}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="mq-wrap">
        <div className="mq-track">
          {['Date Night','Cafes','Adventure','Restaurants','Gift Box','Date Box','Rooftop Dining','Go Karting','Trekking','Cozy Cafes','Fine Dining','Weekend Plans','Date Night','Cafes','Adventure','Restaurants','Gift Box','Date Box','Rooftop Dining','Go Karting','Trekking','Cozy Cafes','Fine Dining','Weekend Plans'].map((t,i) => (
            <span key={i} className="mq-item">{t}<div className="mqdot" /></span>
          ))}
        </div>
      </div>

      {/* EXPLORE */}
     {/* EXPLORE */}
      <section id="explore">
        <div className="slabel-d">Discover</div>
        <div className="stitle-d">What are you<br /><span className="dim">exploring today?</span></div>

        {[
          { label: 'Dates',       c: 'shows',       icon: '💑' },
          { label: 'Trips',       c: 'travel',       icon: '🧭' },
          { label: 'Adventure',   c: 'sports',       icon: '⛰️' },
          { label: 'Cafes',       c: 'cafes',        icon: '☕' },
          { label: 'Restaurants', c: 'restaurants',  icon: '🍽️' },
        ].map(({ label, c, icon }) => (
          <CategoryRow key={c} label={label} icon={icon} cat={c} supabase={_supabase} catMap={catMap} onBook={openBooking} />
        ))}

      </section>

      {/* AI SECTION */}
      <section id="ai-section">
        <div className="slabel-d">AI Agent</div>
        <div className="stitle-d">Your personal<br /><span className="dim">exploration guide</span></div>
        <div className="ai-grid" style={{ width: '100%', boxSizing: 'border-box' }}>
          <div className="ai-info">
            <p>Xploura AI plans your perfect night out — from cafe bookings to date night planning. Just tell it your budget and vibe, we handle the rest.</p>
            <div>
              {[{n:'01',t:'Natural language booking',d:'Say "Plan a Goa trip this weekend for 2" — it books flights, hotel, and activities.'},{n:'02',t:'Mood based discovery',d:'Tell it your vibe — Romantic, Adventure, Chill — and it finds the right spot instantly.'},{n:'03',t:'Smart recommendations',d:'Based on your location, budget, and past trips — suggests the best options.'},{n:'04',t:'One-tap checkout',d:'Review the plan, confirm, pay — all within the conversation.'}].map((f,i) => (
                <div key={i} className="ai-feat"><div className="afn">{f.n}</div><div><div className="aft">{f.t}</div><div className="afd">{f.d}</div></div></div>
              ))}
            </div>
          </div>
          <div className="ai-chat">
            <div className="aich">
              <div className="aiav" />
              <div><div className="ainame">X AI</div><div className="aisub">Powered by Claude · Always on</div></div>
              <div className="aionl">Status: <span>Online</span></div>
            </div>
            <div className="chat-msgs">
              {chatMsgs.map((m, i) => (
                <div key={i} className={`cm ${m.type}`}><div className="cmb">{m.text}</div></div>
              ))}
              {chatTyping && (
                <div className="cm ai">
                  <div className="cmb" style={{display:'flex',gap:5,alignItems:'center',padding:'10px 14px'}}>
                    {[0,0.2,0.4].map((d,i) => (
                      <div key={i} style={{width:7,height:7,borderRadius:'50%',background:'#FF6B00',
                        animation:'dotB 1.2s infinite',animationDelay:`${d}s`}}/>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="chat-sugs">
              {['Plan a date night', 'Friends outing in Pune', 'Best cafes near me', 'Adventure this weekend'].map(s => (
                <button key={s} className="sug" onClick={() => sendChat(s)}>{s}</button>
              ))}
            </div>
            <div className="chat-irow">
              <input className="cinp" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Ask anything — travel, events, food..." />
              <button className="bsend" onClick={() => sendChat()}>
                <svg viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* NEWSLETTER */}
      <section id="newsletter">
        <div className="nl-l">
          <h3>Stay in<br />the loop</h3>
          <p>Best deals on trips, concerts, sports, and dining — every week in your inbox.</p>
        </div>
        <div>
          <div className="nl-row">
            <input className="nlinp" placeholder="your@email.com" type="email" />
            <button className="nlsub">Subscribe</button>
          </div>
          <div className="nlnote">No spam. Unsubscribe anytime.</div>
        </div>
      </section>

      {/* FOOTER */}
      {/* FOOTER */}
      <footer id="footer">
        <div>
          <div className="flogo">Xploura</div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 14, lineHeight: 1.8, maxWidth: 210 }}>Explore the world with AI — travel, events, sports, dining in one place.</p>
        </div>
        {[
          {title:'Explore', links:[{l:'Travel & Trips',h:'#'},{l:'Shows & Concerts',h:'#'},{l:'Sports Events',h:'#'},{l:'Cafes & Restaurants',h:'#'}]},
          {title:'Company', links:[{l:'About Us',h:'#'},{l:'Careers',h:'#'},{l:'Press',h:'#'},{l:'Blog',h:'#'}]},
          {title:'Contact', links:[{l:'hello@xploura.in',h:'mailto:hello@xploura.in'},{l:'Instagram',h:'#'},{l:'Twitter / X',h:'#'},{l:'LinkedIn',h:'#'}]},
          {title:'Business 🏪', links:[{l:'List Your Place',h:'/admin'},{l:'Owner Login',h:'/admin'},{l:'Partner With Us',h:'/admin'}]},
        ].map(col => (
          <div key={col.title}>
            <div className="fcol-t">{col.title}</div>
            <div className="flinks">{col.links.map(l => <a key={l.l} href={l.h} style={{fontSize:13, color: col.title==='Business 🏪' ? 'rgba(255,107,0,0.6)' : 'rgba(255,255,255,0.32)', textDecoration:'none'}}>{l.l}</a>)}</div>
          </div>
        ))}
      </footer>
      <div className="fbot">
        <span className="fcopy">© 2026 Xploura. All rights reserved.</span>
        <span className="fcopy">Built with passion in India</span>
      </div>

      {/* FLOATING AI */}
<div id="ai-fab" onClick={() => setFabOpen(true)}>
  <div className="fab-logo">X</div>
  <div className="fab-label">AI</div>
</div>

{/* AI OVERLAY */}
{fabOpen && (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)'
  }} onClick={() => setFabOpen(false)}>
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: isMobile ? '100%' : '50%', height: '100vh',
      background: '#0f0d0b',
      display: 'flex', flexDirection: 'column',
      boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
    }} onClick={e => e.stopPropagation()}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        background: '#0f0d0b',
        borderBottom: '0.5px solid rgba(255,107,0,0.3)',
        flexShrink: 0
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 18, letterSpacing: '0.15em', color: '#FF6B00'
        }}>X AI AGENT</span>
        <button onClick={() => setFabOpen(false)} style={{
          background: 'rgba(255,255,255,0.08)', border: 'none',
          color: '#fff', fontSize: 18, width: 34, height: 34,
          borderRadius: '50%', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>×</button>
      </div>
      {/* iframe */}
     <iframe
  src="/ai-agent"
  style={{ flex: 1, width: '100%', border: 'none' }}
  onLoad={(e) => {
    try {
      (e.target as HTMLIFrameElement).contentWindow?.scrollTo(0, 0);
    } catch {}
  }}
/>
    </div>
  </div>
)}

      {/* MOBILE NAV */}
      <div id="mobile-nav">
        <button className="mnav-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </button>
        <button className="mnav-btn" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Explore</span>
        </button>
        <button className="mnav-btn" style={{ marginTop: -20 }} onClick={() => setFabOpen(true)}>
  <div style={{
    width: 52, height: 52, borderRadius: '50%',
    background: '#FF6B00',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(255,107,0,0.5)',
    border: '3px solid #0f0d0b',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 22, color: '#fff', letterSpacing: '0.05em'
  }}>X</div>
  <span>AI</span>
</button>
        <button className="mnav-btn" onClick={() => {
  if (user) {
    window.location.href = '/userbooking';
  } else {
    window.location.href = '/auth';
  }
}} style={{ color: user ? '#FF6B00' : 'rgba(255,255,255,0.4)' }}>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
  <span>Bookings</span>
</button>
      <button className="mnav-btn" onClick={() => {
  if (user) {
    const sheet = document.getElementById('mobile-profile-sheet');
    if (sheet) sheet.style.display = sheet.style.display === 'flex' ? 'none' : 'flex';
  } else {
    setGuestSheetOpen(true);
  }
}}>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
  <span>Profile</span>
</button>
      </div>

{/* MOBILE PROFILE SHEET */}
<div id="mobile-profile-sheet" style={{
  display: 'none',
  position: 'fixed', bottom: 64, left: 0, right: 0,
  background: '#161412',
  borderRadius: '20px 20px 0 0',
  zIndex: 998, flexDirection: 'column',
  boxShadow: '0 -20px 60px rgba(0,0,0,0.85)',
  fontFamily: "'DM Sans', sans-serif",
  maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden',
}}>

  {/* Orange top bar */}
  <div style={{ height: 3, background: 'linear-gradient(90deg, #FF6B00, #FF9240)', flexShrink: 0 }} />

  {/* User Header */}
  <div style={{ padding: '22px 20px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {(userProfile?.avatar_url || user?.user_metadata?.avatar_url) ? (
        <img
          src={userProfile?.avatar_url || user?.user_metadata?.avatar_url}
          style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #FF6B00' }}
        />
      ) : (
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,107,0,0.25), rgba(255,107,0,0.08))',
          border: '2.5px solid #FF6B00',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 700, color: '#FF6B00',
          fontFamily: "'Bebas Neue', sans-serif",
        }}>
          {(userProfile?.full_name || user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 2, right: 2,
        width: 13, height: 13, borderRadius: '50%',
        background: '#22c55e', border: '2.5px solid #161412',
      }} />
    </div>

    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
        {userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Explorer'}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {user?.email}
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'rgba(255,107,0,0.12)', border: '0.5px solid rgba(255,107,0,0.35)',
        borderRadius: 20, padding: '4px 10px',
      }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#FF6B00">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span style={{ fontSize: 9, color: '#FF6B00', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Explorer Member</span>
      </div>
    </div>
  </div>

  {/* Stats Row — only renders when user has real bookings */}
  {(userStats.trips > 0 || userStats.reservations > 0 || userStats.savedCafes > 0) && (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      margin: '0 16px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: '0.5px solid rgba(255,255,255,0.07)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      {[
        { n: userStats.trips, l: 'Trips',
          icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20"/></svg> },
        { n: userStats.reservations, l: 'Reservations',
          icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0"/></svg> },
        { n: userStats.savedCafes, l: 'Saved Cafes',
          icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
      ].map((s, i) => (
        <div key={i} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '14px 8px',
          borderRight: i < 2 ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
        }}>
          {s.icon}
          <div style={{ fontSize: 22, fontFamily: "'Bebas Neue', sans-serif", color: '#FF6B00', letterSpacing: '0.04em', margin: '5px 0 2px', lineHeight: 1 }}>{s.n}</div>
          <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.l}</div>
        </div>
      ))}
    </div>
  )}

  {/* Menu Items */}
  <div style={{
    margin: '0 16px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '0.5px solid rgba(255,255,255,0.07)',
    borderRadius: 14, overflow: 'hidden',
  }}>
    {[
      {
        href: '/userbooking',
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
        title: 'My Bookings', sub: 'View and manage your bookings',
      },
      {
        href: '/saved',
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
        title: 'Saved Places', sub: 'Your favorite cafes & restaurants',
      },
      {
        href: '/reservations',
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
        title: 'My Reservations', sub: 'Tickets, passes and reservations',
      },
      {
        href: '/settings',
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
        title: 'Settings', sub: 'Preferences and account settings',
      },
      {
        href: '/profile',
        icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
        title: 'Profile', sub: 'Personal information and details',
      },
    ].map((item, i, arr) => (
      <a key={i} href={item.href}
        onClick={() => { const s = document.getElementById('mobile-profile-sheet'); if (s) s.style.display = 'none'; }}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', textDecoration: 'none',
          borderBottom: i < arr.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
        }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: 'rgba(255,107,0,0.1)', border: '0.5px solid rgba(255,107,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {item.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.title}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', marginTop: 1.5 }}>{item.sub}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>
    ))}
  </div>

  {/* Sign Out */}
  <div style={{ margin: '0 16px 12px' }}>
    <button onClick={async () => { await _supabase.auth.signOut(); window.location.href = '/'; }} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px', borderRadius: 14,
      background: 'rgba(255,50,50,0.06)', border: '0.5px solid rgba(255,50,50,0.15)',
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textAlign: 'left',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: 'rgba(255,50,50,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,80,80,0.85)" strokeWidth="1.8">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,80,80,0.9)' }}>Sign Out</div>
        <div style={{ fontSize: 10.5, color: 'rgba(255,80,80,0.4)', marginTop: 1.5 }}>Log out from your account</div>
      </div>
    </button>
  </div>

  {/* Footer bar */}
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 20px 28px',
    borderTop: '0.5px solid rgba(255,255,255,0.05)',
    marginTop: 4,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}>Secure & Private</span>
    </div>
    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.04em' }}>v1.0.0</span>
  </div>
</div>

{/* GUEST PROFILE SHEET — non-logged-in users */}
{guestSheetOpen && (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 9990,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)',
    }}
    onClick={() => setGuestSheetOpen(false)}
  >
    <div
      style={{
        position: 'absolute', bottom: 64, left: 0, right: 0,
        background: '#161412',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: '20px 20px 0 0',
        zIndex: 9991,
        boxShadow: '0 -12px 60px rgba(0,0,0,0.7)',
        fontFamily: "'DM Sans', sans-serif",
        overflow: 'hidden',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Orange top bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #FF6B00, #ff9240)' }} />

      <div style={{ padding: '22px 20px 28px' }}>

        {/* Logo + tagline */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: '0.22em' }}>
            <span style={{ color: '#FF6B00' }}>X</span>
            <span style={{ color: '#fff' }}>PLOURA</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 5, letterSpacing: '0.04em', lineHeight: 1.5 }}>
            Pune's AI-powered exploration platform
          </div>
        </div>

        {/* About features — professional SVG icons */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 0,
          marginBottom: 20,
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 12,
          border: '0.5px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
        }}>
          {[
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
              ),
              title: 'X AI Agent',
              desc: 'Plans your entire night or weekend trip',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              ),
              title: 'Curated in Pune',
              desc: 'Verified cafes, dates, trips & adventure',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0"/>
                  <line x1="12" y1="12" x2="12" y2="16"/>
                  <line x1="10" y1="14" x2="14" y2="14"/>
                </svg>
              ),
              title: 'One-tap Booking',
              desc: 'Book events, cafes & adventures instantly',
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              ),
              title: 'Secure Checkout',
              desc: 'Safe payments — no hidden charges',
            },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 16px',
              borderBottom: i < arr.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: 'rgba(255,107,0,0.1)',
                border: '0.5px solid rgba(255,107,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, letterSpacing: '0.02em' }}>{item.title}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1, letterSpacing: '0.02em' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* About Us link */}
        <a
          href="/about"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '11px', borderRadius: 10, marginBottom: 12,
            border: '0.5px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            fontSize: 11, color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          About Xploura
        </a>

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            href="/auth?tab=signup"
            style={{
              display: 'block', textAlign: 'center',
              background: '#FF6B00',
              color: '#fff',
              padding: '14px', borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Get Started — Its Free
          </a>
          <a
            href="/auth"
            style={{
              display: 'block', textAlign: 'center',
              border: '0.5px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)',
              padding: '13px', borderRadius: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, letterSpacing: '0.08em',
              textTransform: 'uppercase', textDecoration: 'none',
            }}
          >
            Sign In
          </a>
          <button
            onClick={() => setGuestSheetOpen(false)}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.2)', fontSize: 12,
              cursor: 'pointer', padding: '8px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  </div>
)}

 <style>{`
  @keyframes dotB { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-5px);opacity:1} }
  @keyframes liveBlink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
  @media (max-width: 768px) {
    body, main, section, #stats, #ai-section, #explore, #newsletter, #footer {
      width: 100% !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
    }
    .lslide { padding: 0 16px !important; width: 100% !important; }
  }
`}</style>
    </>
  );
}