'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

import { motion } from 'motion/react';
import { FaUtensils, FaCompass, FaCoffee, FaHeart, FaMountain } from 'react-icons/fa';
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
    { type: 'ai', text: "Hey! I'm X AI. Tell me where you want to go, what you want to watch, eat, or do — I'll plan and book it all for you." }
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
  const [dropOpen, setDropOpen] = useState(false);
  const [chatTyping, setChatTyping] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
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
    'Dev booked IPL tickets · 3 min ago',
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

  // NAV SCROLL
  useEffect(() => {
    const onScroll = () => {
      const nav = document.getElementById('main-nav');
      if (nav) nav.className = window.scrollY > 60 ? 'sc' : '';
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // CARDS
  useEffect(() => { buildCards(activeCat); }, [activeCat]);

  

  // Close dropdown on outside click
useEffect(() => {
  const handler = (e: MouseEvent) => {
    const dd = document.getElementById('nav-dd');
    if (dd && !dd.contains(e.target as Node)) {
      setDropOpen(false);
    }
  };
  document.addEventListener('mousedown', handler);
  return () => document.removeEventListener('mousedown', handler);
}, []);

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
    const groqKey = process.env.NEXT_PUBLIC_GROQ_KEY;
    if (groqKey) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + groqKey },
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
    }
  } catch {}

  // Fallback if Groq fails
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
    { label: 'LIVE NOW', title: 'IPL 2026 — Tickets Selling Fast', sub: 'MI vs CSK · Wankhede · From ₹1,200', btn: 'Book Now →', bg: 'url(https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80)' },
    { label: 'TRENDING', title: 'Lonavala Weekend — Slots Almost Full', sub: 'Waterfalls + Cafes · 65km · From ₹2,500', btn: 'Explore →', bg: 'url(https://images.unsplash.com/photo-1670258896861-b77a8cf6075c?w=1200&q=80)' },
    { label: 'HOT DEAL', title: 'Pawna Lake Camping — Book Tonight', sub: 'Stargazing + Bonfire · 80km · From ₹1,800', btn: 'Camp Now →', bg: 'url(https://images.unsplash.com/photo-1595084305818-84c2daca7482?w=1200&q=80)' },
    { label: 'POPULAR', title: 'Paasha Rooftop — Date Night Special', sub: 'JW Marriott · KP · ₹2,500/head · 4.9★', btn: 'Reserve →', bg: 'url(https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80)' },
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
<nav id="main-nav" style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 48px', position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(15,13,11,0.92)', backdropFilter:'blur(20px)'}}>

  <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
  <span style={{
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 26,
    letterSpacing: '0.22em',
    lineHeight: 1,
    fontWeight: 700,
  }}>
    <span style={{ color: '#FF6B00' }}>X</span>
    <span style={{ color: '#ffffff' }}>PLOURA</span>
  </span>
</a>

  <ul style={{display:'flex', gap:32, listStyle:'none', margin:0, padding:0}}>
    <li><a href="/trips" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>Trips</a></li>
    <li><a href="/dates" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>Dates</a></li>
    <li><a href="/cafes" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>Cafes</a></li>
    <li><a href="/restaurants" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>Restaurants</a></li>
    <li><a href="/adventure" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>Adventure</a></li>
    <li><a href="/ai-agent" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>X AI Agent</a></li>
    <li><a href="/about" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>About</a></li>
  </ul>

 <div style={{display:'flex', gap:10, alignItems:'center', position:'relative'}}>
  {authLoading ? (
    <div style={{width: 36, height: 36, borderRadius:'50%', background:'rgba(255,255,255,0.06)'}} />
  ) : user ? (
    <div style={{position:'relative', display: isMobile ? 'none' : 'block'}} id="nav-dd">
  {/* Avatar Circle — click karo dropdown ke liye */}
 <div onClick={() => setDropOpen(p => !p)} style={{
  width: 36, height: 36, borderRadius: '50%',
  background: 'rgba(255,107,0,0.15)',
  border: '1.5px solid #FF6B00',
  display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer',
  position: 'relative', overflow: 'hidden'
}}>
  {/* Professional user icon */}
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#FF6B00" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
</div>

      {/* Dropdown */}
      {/* Dropdown */}
      {dropOpen && (
      <div
        style={{
          position:'absolute', top: 46, right: 0,
          background:'#1a1714', border:'0.5px solid rgba(255,255,255,0.1)',
          borderRadius: 10, minWidth: 180, zIndex: 999,
          boxShadow:'0 16px 40px rgba(0,0,0,0.6)',
          overflow:'hidden'
        }}>
        {/* User info */}
        <div style={{padding:'12px 16px', borderBottom:'0.5px solid rgba(255,255,255,0.07)'}}>
          <div style={{fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:'0.06em', fontFamily:"'DM Sans',sans-serif"}}>Signed in as</div>
          <div style={{fontSize:12, color:'#fff', fontWeight:500, marginTop:2, fontFamily:"'DM Sans',sans-serif", overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:148}}>
            {user.email}
          </div>
        </div>
        {/* My Bookings */}
<a href="/userbooking" style={{
  display:'flex', alignItems:'center', gap:10,
  padding:'11px 16px', fontSize:12, color:'rgba(255,255,255,0.6)',
  textDecoration:'none', fontFamily:"'DM Sans',sans-serif",
  transition:'background 0.2s, color 0.2s',
  borderBottom:'0.5px solid rgba(255,255,255,0.05)'
}}
onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background='rgba(255,107,0,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color='#FF6B00'; }}
onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background='transparent'; (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.6)'; }}>
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
  My Bookings
</a>
        {/* Profile */}
        <a href="/profile" style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'11px 16px', fontSize:12, color:'rgba(255,255,255,0.6)',
          textDecoration:'none', fontFamily:"'DM Sans',sans-serif",
          transition:'background 0.2s, color 0.2s',
          borderBottom:'0.5px solid rgba(255,255,255,0.05)'
        }}
        onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background='rgba(255,107,0,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color='#FF6B00'; }}
        onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background='transparent'; (e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.6)'; }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Profile
        </a>
        {/* Sign Out */}
        <button
          onClick={async () => { await _supabase.auth.signOut(); window.location.href = '/'; }}
          style={{
            width:'100%', padding:'11px 16px',
            display:'flex', alignItems:'center', gap:10,
            fontSize:12, color:'rgba(255,80,80,0.75)',
            background:'transparent', border:'none', cursor:'pointer',
            fontFamily:"'DM Sans',sans-serif", textAlign:'left',
            transition:'background 0.2s'
          }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background='rgba(255,50,50,0.08)'; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background='transparent'; }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
    <>
      <a href="/auth" style={{fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', border:'0.5px solid rgba(255,255,255,0.12)', padding:'9px 20px', borderRadius:24, color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>Sign In</a>
      <a href="/auth?tab=signup" style={{fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', background:'#FF6B00', color:'#fff', padding:'9px 20px', borderRadius:24, textDecoration:'none'}}>Get Started</a>
    </>
  )}
</div>

</nav>
      {/* HERO */}
      <section id="hero">
        <div className="hbg" ref={hbgRef} />
        <div className="hbg-overlay" />
        <div className="hbg-overlay-tb" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge"><div className="hbdot" />AI-Powered Booking Platform</div>
            <h1 className="hero-h1">
              <span className="hs1">Explore</span>
              <span className="hs2">Every</span>
              <span className="hs3">World</span>
            </h1>
            <p className="hero-sub">Dates · Cafes · Adventure · Restaurants · Trips<br />Step into your next experience</p>
            <div className="hero-cta-row">
              <button className="hbtn-primary" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>Plan My Night →</button>
              <button className="hbtn-ghost" onClick={() => document.getElementById('ai-section')?.scrollIntoView({ behavior: 'smooth' })}>Meet X AI</button>
            </div>
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
                <div className="hcard-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80')" }} />
                <div className="featured-label">⭐ Featured</div>
                <div className="hcard-badge">🔥 Trending</div>
                <div className="hcard-body"><div className="hcard-tag">Adventure · 65km</div><div className="hcard-name">Lonavala</div><div className="hcard-price">From ₹2,500 · 4.9★</div></div>
              </div>
              {/* T1 */}
              <div className="hcard hcard-t1">
                <div className="hcard-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80')" }} />
                <div className="hcard-badge">💑 Hot</div>
                <div className="hcard-body"><div className="hcard-tag">Date Night · KP</div><div className="hcard-name">Paasha Rooftop</div><div className="hcard-price">₹2,500/head</div></div>
              </div>
              {/* T2 */}
              <div className="hcard hcard-t2">
                <div className="hcard-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595084305818-84c2daca7482?w=600&q=80')" }} />
                <div className="hcard-badge">⛺ New</div>
                <div className="hcard-body"><div className="hcard-tag">Camping · 80km</div><div className="hcard-name">Pawna Lake</div><div className="hcard-price">From ₹1,800</div></div>
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
          {[{n:'240',s:'+',l:'Destinations worldwide'},{n:'18',s:'K',l:'Events listed'},{n:'4.9',s:'',l:'Average rating'},{n:'92',s:'K',l:'Happy explorers'}].map((s,i) => (
            <div key={i} className="stat"><div className="stn"><span>{s.n}</span>{s.s}</div><div className="stl">{s.l}</div></div>
          ))}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="mq-wrap">
        <div className="mq-track">
          {['Travel','Adventure','Concerts','Sports','Fine Dining','Cafes','Weekend Trips','Live Events','Travel','Adventure','Concerts','Sports','Fine Dining','Cafes','Weekend Trips','Live Events'].map((t,i) => (
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
            <p>Xploura AI plans your entire experience — from flights to dinner reservations. Just tell it what you want, voice or text, Hindi or English.</p>
            <div>
              {[{n:'01',t:'Natural language booking',d:'Say "Plan a Goa trip this weekend for 2" — it books flights, hotel, and activities.'},{n:'02',t:'Voice + text input',d:'Speak in Hindi or English. The AI understands and responds instantly.'},{n:'03',t:'Smart recommendations',d:'Based on your location, budget, and past trips — suggests the best options.'},{n:'04',t:'One-tap checkout',d:'Review the plan, confirm, pay — all within the conversation.'}].map((f,i) => (
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
              {['Plan Mumbai trip 3 days','IPL match tickets','Best cafes in Pune','Goa weekend'].map(s => (
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
    window.location.href = '/auth';
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
  background: '#1a1714',
  border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '16px 16px 0 0',
  zIndex: 998, flexDirection: 'column',
  boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
  fontFamily: "'DM Sans', sans-serif"
}}>
  {/* Header */}
  <div style={{padding:'16px 20px', borderBottom:'0.5px solid rgba(255,255,255,0.07)'}}>
    <div style={{fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4}}>Signed in as</div>
    <div style={{fontSize:13, color:'#fff', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
      {user?.email}
    </div>
  </div>

  {/* Profile */}
  <a href="/profile" style={{
    display:'flex', alignItems:'center', gap:14,
    padding:'16px 20px', fontSize:14, color:'rgba(255,255,255,0.7)',
    textDecoration:'none', borderBottom:'0.5px solid rgba(255,255,255,0.05)'
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
    Profile
  </a>

  {/* About */}
  <a href="/about" style={{
    display:'flex', alignItems:'center', gap:14,
    padding:'16px 20px', fontSize:14, color:'rgba(255,255,255,0.7)',
    textDecoration:'none', borderBottom:'0.5px solid rgba(255,255,255,0.05)'
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    About
  </a>

  {/* Sign Out */}
  <button onClick={async () => {
    await _supabase.auth.signOut();
    window.location.href = '/';
  }} style={{
    display:'flex', alignItems:'center', gap:14,
    padding:'16px 20px', fontSize:14, color:'rgba(255,80,80,0.85)',
    background:'transparent', border:'none', cursor:'pointer',
    fontFamily:"'DM Sans',sans-serif", textAlign:'left',
    borderBottom:'0.5px solid rgba(255,255,255,0.05)'
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
    Sign Out
  </button>

  {/* Cancel */}
  <button onClick={() => {
    const sheet = document.getElementById('mobile-profile-sheet');
    if (sheet) sheet.style.display = 'none';
  }} style={{
    padding:'16px 20px', fontSize:13,
    color:'rgba(255,255,255,0.3)', background:'transparent',
    border:'none', cursor:'pointer',
    fontFamily:"'DM Sans',sans-serif", textAlign:'center'
  }}>
    Cancel
  </button>
</div>

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