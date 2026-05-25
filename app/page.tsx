'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

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
  const [curPos, setCurPos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [slideIdx, setSlideIdx] = useState(0);
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

  async function buildCards(cat: string) {
    const { data } = await _supabase.from('cafes').select('*').eq('category', catMap[cat] || cat).order('area', { ascending: true });
    setCards(data || []);
  }

  function openBooking(d: any) {
    window.location.href = `/booking?data=${encodeURIComponent(JSON.stringify(d))}`;
  }

  const REPS: any = {
    mumbai: ['Found amazing Mumbai packages!', '3D/2N from ₹8,500 — Gateway, Marine Drive, street food tour. Book it?'],
    ipl: ['IPL 2026 tickets available!', 'MI vs CSK at Wankhede — ₹1,200 (Gen) to ₹8,500 (Premium). Check availability?'],
    cafe: ['Top Pune cafes found!', 'Pagdandi (Baner), The Flour Works (KP), Vohuman (Camp). Reserve a table?'],
    goa: ['Goa weekend sorted!', '2N/3D — Calangute resort + scooter + beach shacks. ₹6,800/person. Book now?'],
    def: ['On it! Searching for you...', 'Found great options matching your request. Want me to show the best picks?'],
  };
  function getRep(t: string) {
    t = t.toLowerCase();
    if (t.includes('mumbai') || t.includes('trip')) return REPS.mumbai;
    if (t.includes('ipl') || t.includes('cricket')) return REPS.ipl;
    if (t.includes('cafe') || t.includes('coffee')) return REPS.cafe;
    if (t.includes('goa') || t.includes('beach')) return REPS.goa;
    return REPS.def;
  }
  function sendChat() {
    if (!chatInput.trim()) return;
    const txt = chatInput.trim(); setChatInput('');
    setChatMsgs(prev => [...prev, { type: 'user', text: txt }]);
    const r = getRep(txt);
    setTimeout(() => { r.forEach((m: string, i: number) => { setTimeout(() => { setChatMsgs(prev => [...prev, { type: 'ai', text: m }]); }, i * 700); }); }, 1000);
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
  <nav id="main-nav" style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 48px', position:'fixed', top:0, left:0, right:0, zIndex:100, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(20px)'}}>
  <a href="/" style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:'0.14em', color:'#fff', textDecoration:'none'}}>Xploura</a>
  <ul style={{display:'flex', gap:32, listStyle:'none', margin:0, padding:0}}>
    {[['Trips','travel'],['Dates','shows'],['Cafes','cafes'],['Restaurants','restaurants'],['Adventure','sports']].map(([l,c]) => (
      <li key={l}><a href="#explore" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}} onClick={() => setActiveCat(c)}>{l}</a></li>
    ))}
    <li><a href="/ai-agent" style={{fontSize:11, letterSpacing:'0.13em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>X AI Agent</a></li>
  </ul>
  <div style={{display:'flex', gap:10}}>
    <a href="/auth" style={{fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', border:'0.5px solid rgba(255,255,255,0.12)', padding:'9px 20px', borderRadius:24, color:'rgba(255,255,255,0.55)', textDecoration:'none'}}>Sign in</a>
    <a href="/auth?tab=signup" style={{fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', background:'#FF6B00', color:'#fff', padding:'9px 20px', borderRadius:24, textDecoration:'none'}}>Get Started</a>
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
        <div style={{ position: 'relative', width: '100%', height: 150, overflow: 'hidden' }}>
          {slides.map((s, i) => (
            <div key={i} className="lslide" style={{ opacity: i === slideIdx ? 1 : 0, background: `linear-gradient(90deg,rgba(0,0,0,0.85) 30%,rgba(0,0,0,0.3) 100%),${s.bg} center/cover` }}>
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
      <section id="explore">
        <div className="slabel-d">Discover</div>
        <div className="stitle-d">What are you<br /><span className="dim">exploring today?</span></div>
        <div className="search-row">
          <input id="search-inp" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search cafes, places, restaurants..." />
        </div>
        <div className="cat-row">
          {[{l:'Dates',c:'shows'},{l:'Trips',c:'travel'},{l:'Adventure',c:'sports'},{l:'Cafes',c:'cafes'},{l:'Restaurants',c:'restaurants'}].map(({l,c}) => (
            <button key={c} className={`cat-btn${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>{l}</button>
          ))}
        </div>
        <div className="cards-grid">
          {filteredCards.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'rgba(0,0,0,0.3)' }}>No listings found</div>
          ) : filteredCards.map((d, i) => (
            <div key={i} className="card" onClick={() => openBooking(d)}>
              <div className="card-scene">
                {d.image_url ? <img src={d.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s' }} onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')} onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} /> : null}
              </div>
              <div className="card-overlay">
                <div className="ctag">{d.tag || `${d.category} · ${d.area}`}</div>
                <div className="cname">{d.name}</div>
                <div className="cprice">{d.price}</div>
              </div>
              <div className="cbadge">⭐{d.rating}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI SECTION */}
      <section id="ai-section">
        <div className="slabel-d">AI Agent</div>
        <div className="stitle-d">Your personal<br /><span className="dim">exploration guide</span></div>
        <div className="ai-grid">
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
            </div>
            <div className="chat-sugs">
              {['Plan Mumbai trip 3 days','IPL match tickets','Best cafes in Pune','Goa weekend'].map(s => (
                <button key={s} className="sug" onClick={() => { setChatInput(s); setTimeout(sendChat, 50); }}>{s}</button>
              ))}
            </div>
            <div className="chat-irow">
              <input className="cinp" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Ask anything — travel, events, food..." />
              <button className="bsend" onClick={sendChat}>
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
      <footer id="footer">
        <div>
          <div className="flogo">Xploura</div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 14, lineHeight: 1.8, maxWidth: 210 }}>Explore the world with AI — travel, events, sports, dining in one place.</p>
        </div>
        {[{title:'Explore',links:['Travel & Trips','Shows & Concerts','Sports Events','Cafes & Restaurants']},{title:'Company',links:['About Us','Careers','Press','Blog']},{title:'Contact',links:['hello@xploura.in','Instagram','Twitter / X','LinkedIn']}].map(col => (
          <div key={col.title}>
            <div className="fcol-t">{col.title}</div>
            <div className="flinks">{col.links.map(l => <a key={l} href="#">{l}</a>)}</div>
          </div>
        ))}
      </footer>
      <div className="fbot">
        <span className="fcopy">© 2026 Xploura. All rights reserved.</span>
        <span className="fcopy">Built with passion in India</span>
      </div>

      {/* FLOATING AI */}
      <div id="ai-fab" onClick={() => window.location.href = '/ai-agent'}>
        <div className="fab-logo">X</div>
        <div className="fab-label">AI</div>
      </div>

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
        <button className="mnav-btn" style={{ marginTop: -20 }} onClick={() => window.location.href = '/ai-agent'}>
          <div className="mnav-ai-btn">X</div>
          <span>AI</span>
        </button>
        <button className="mnav-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>
          <span>Gifts</span>
        </button>
        <button className="mnav-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Profile</span>
        </button>
      </div>

      <style>{`
        @keyframes liveBlink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
      `}</style>
    </>
  );
}