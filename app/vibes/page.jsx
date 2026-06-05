'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const vibes = [
  {
    id: 'romantic',
    label: 'Romantic',
    tagline: 'For nights that mean something',
    color: '#FF6B6B',
    bgGrad: 'linear-gradient(135deg, #2a0a0a 0%, #1a0808 100%)',
    accent: 'rgba(255,107,107,0.15)',
    border: 'rgba(255,107,107,0.3)',
    tags: ['Rooftop Cafes', 'Sunset Spots', 'Couple Pottery', 'Date Boxes', 'Fine Dining'],
    count: '48 places',
    mood: 'intimate',
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'rainy',
    label: 'Rainy',
    tagline: 'Monsoon magic, cozy corners',
    color: '#7EC8E3',
    bgGrad: 'linear-gradient(135deg, #060f14 0%, #080d12 100%)',
    accent: 'rgba(126,200,227,0.12)',
    border: 'rgba(126,200,227,0.25)',
    tags: ['Rain Drives', 'Monsoon Cafes', 'Waterfalls', 'Cozy Nooks', 'Chai Spots'],
    count: '32 places',
    mood: 'dreamy',
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
        <line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/>
        <line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/>
        <line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/>
        <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/>
      </svg>
    ),
  },
  {
    id: 'cozy',
    label: 'Cozy',
    tagline: 'Slow down, sip deep',
    color: '#D4A574',
    bgGrad: 'linear-gradient(135deg, #1a1008 0%, #120d05 100%)',
    accent: 'rgba(212,165,116,0.12)',
    border: 'rgba(212,165,116,0.28)',
    tags: ['Aesthetic Cafes', 'Book Cafes', 'Work Cafes', 'Quiet Spots', 'Hidden Gems'],
    count: '61 places',
    mood: 'warm',
    img: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
        <path d="M18 8h1a4 4 0 010 8h-1"/>
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
  {
    id: 'adventure',
    label: 'Adventure',
    tagline: 'Push your limits today',
    color: '#7DDE8B',
    bgGrad: 'linear-gradient(135deg, #061209 0%, #040e06 100%)',
    accent: 'rgba(125,222,139,0.12)',
    border: 'rgba(125,222,139,0.25)',
    tags: ['Trekking', 'Camping', 'Rappelling', 'Night Hikes', 'Waterfall Trails'],
    count: '29 places',
    mood: 'wild',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
        <polygon points="3 17 12 3 21 17"/>
        <line x1="3" y1="17" x2="21" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'peaceful',
    label: 'Peaceful',
    tagline: 'Find your calm here',
    color: '#90E0C2',
    bgGrad: 'linear-gradient(135deg, #060f0a 0%, #040c08 100%)',
    accent: 'rgba(144,224,194,0.1)',
    border: 'rgba(144,224,194,0.22)',
    tags: ['Meditation', 'Sound Healing', 'Lakeside Spots', 'Nature Escapes', 'Wellness'],
    count: '21 places',
    mood: 'serene',
    img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
        <path d="M12 22V12m0 0C12 6.477 7.523 2 2 2c0 5.523 4.477 10 10 10zm0 0c0-5.523 4.477-10 10-10-5.523 0-10 4.477-10 10z"/>
      </svg>
    ),
  },
  {
    id: 'night',
    label: 'Night Vibes',
    tagline: 'Pune after dark',
    color: '#C4A8FF',
    bgGrad: 'linear-gradient(135deg, #0d0814 0%, #08050f 100%)',
    accent: 'rgba(196,168,255,0.1)',
    border: 'rgba(196,168,255,0.22)',
    tags: ['Night Cafes', 'Live Music', 'City Lights', 'Rooftop Dining', 'Late Drives'],
    count: '37 places',
    mood: 'electric',
    img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
    ),
  },
  {
    id: 'social',
    label: 'Social',
    tagline: 'Your crew plus good energy',
    color: '#FFB347',
    bgGrad: 'linear-gradient(135deg, #160d00 0%, #100900 100%)',
    accent: 'rgba(255,179,71,0.12)',
    border: 'rgba(255,179,71,0.28)',
    tags: ['Creator Meetups', 'Standup Comedy', 'Karaoke', 'Music Events', 'Social Nights'],
    count: '19 places',
    mood: 'buzzing',
    img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    id: 'drive',
    label: 'Drive',
    tagline: 'Roads that go nowhere, perfectly',
    color: '#FF9E64',
    bgGrad: 'linear-gradient(135deg, #140800 0%, #0f0600 100%)',
    accent: 'rgba(255,158,100,0.1)',
    border: 'rgba(255,158,100,0.22)',
    tags: ['Scenic Drives', 'Hidden Roads', 'Late Night Drives', 'Hill Viewpoints', 'Roadtrip Spots'],
    count: '15 routes',
    mood: 'free',
    img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
];

const mockPlaces = [
  { name: 'Paasha Rooftop', area: 'Koregaon Park', price: '2,500 / head', rating: '4.9' },
  { name: 'Pagdandi Books', area: 'Baner', price: '350', rating: '4.8' },
  { name: 'Elephant & Co', area: 'Camp', price: '1,800 / head', rating: '4.7' },
];

export default function VibesPage() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tickIdx, setTickIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);  // ← ADD KARO

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth <= 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

  const ticks = [
    '147 people exploring vibes right now',
    'New — Monsoon Rainy drops added this week',
    'Paasha Rooftop booked 3x today',
    'Peaceful vibes trending this week',
  ];

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTickIdx(p => (p + 1) % ticks.length), 3200);
    return () => clearInterval(t);
  }, []);

  const activeVibe = vibes.find(v => v.id === active);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0c0a08',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
    }}>

      {!isMobile && <Navbar active="vibes" />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}

        .vcard {
          position: relative; border-radius: 16px; overflow: hidden;
          cursor: pointer; flex-shrink: 0;
          transition: transform 0.32s cubic-bezier(0.34,1.4,0.64,1), border-color 0.22s;
        }
        .vcard:hover { transform: translateY(-5px) scale(1.025); }
        .vcard.sel { transform: translateY(-7px) scale(1.04); }

        .pill {
          display: inline-flex; align-items: center;
          padding: 5px 13px; border-radius: 100px;
          font-size: 10.5px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          border: 1px solid; white-space: nowrap;
          transition: transform 0.18s;
        }
        .pill:hover { transform: translateY(-2px); cursor: pointer; }

        .hscroll {
          display: flex; gap: 12px;
          overflow-x: auto; scrollbar-width: none; padding-bottom: 2px;
        }
        .hscroll::-webkit-scrollbar { display: none; }

        .panel { animation: pIn 0.38s cubic-bezier(0.34,1.3,0.64,1) forwards; }
        @keyframes pIn {
          from { opacity:0; transform: translateY(18px) scale(0.97); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }

        .pcard {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px; overflow: hidden;
          cursor: pointer; flex-shrink: 0;
          transition: border-color 0.2s, transform 0.2s;
        }
        .pcard:hover { transform: translateY(-3px); }

        .gbox {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px; border-radius: 12px;
          cursor: pointer; transition: all 0.22s;
        }

        .fade { opacity:0; transform:translateY(20px); animation: fUp 0.55s ease forwards; }
        @keyframes fUp { to { opacity:1; transform:translateY(0); } }

        .dot-pulse {
          width:6px; height:6px; border-radius:50%;
          background:#FF6B00;
          animation: dp 2s ease-in-out infinite;
        }
        @keyframes dp {
          0%,100%{ opacity:1; transform:scale(1); }
          50%{ opacity:0.5; transform:scale(0.75); }
        }

        .tick-in { animation: tIn 0.4s ease forwards; }
        @keyframes tIn {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .cta-btn {
          display:flex; align-items:center; justify-content:center;
          gap:8px; width:100%; padding:13px 20px;
          border-radius:100px; border:none; cursor:pointer;
          font-family:"DM Sans",sans-serif; font-size:11px;
          font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .cta-btn:hover { transform:translateY(-2px); }
        .cta-btn:active { transform:translateY(0); }
      `}</style>

      {/* Ambient */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-15%', left:'-8%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,0,0.045) 0%, transparent 70%)' }}/>
        <div style={{ position:'absolute', bottom:'5%', right:'-12%', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,0,0.03) 0%, transparent 70%)' }}/>
      </div>

      <div style={{ position:'relative', zIndex:1, paddingBottom: isMobile ? 80 : 0 }}>

        {/* ── HEADER ── */}
        <div style={{ padding: isMobile ? '24px 24px 0' : '28px 24px 0', maxWidth:480, margin:'0 auto' }}>

          {/* Ticker */}
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            background:'rgba(255,107,0,0.07)',
            border:'1px solid rgba(255,107,0,0.16)',
            borderRadius:100, padding:'6px 14px',
            width:'fit-content', marginBottom:26,
            opacity: loaded ? 1 : 0, transition:'opacity 0.5s ease 0.1s',
          }}>
            <div className="dot-pulse"/>
            <span key={tickIdx} className="tick-in" style={{
              fontSize:11, color:'rgba(255,255,255,0.6)',
              letterSpacing:'0.04em', fontWeight:500,
            }}>{ticks[tickIdx]}</span>
          </div>

          {/* Heading */}
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(18px)',
            transition:'all 0.6s cubic-bezier(0.34,1.1,0.64,1) 0.15s',
          }}>
            <div style={{
              fontSize:9, letterSpacing:'0.28em', textTransform:'uppercase',
              color:'#FF6B00', fontWeight:700, marginBottom:10,
            }}>Discover · Pune</div>

            <h1 style={{
              fontFamily:"'Bebas Neue', sans-serif",
              fontSize:62, lineHeight:0.93, letterSpacing:'0.02em',
              color:'#fff', marginBottom:12,
            }}>
              Pick Your<br/>
              <span style={{ WebkitTextStroke:'1.5px rgba(255,255,255,0.22)', color:'transparent' }}>Vibe</span>
            </h1>

            <p style={{
              fontSize:13, color:'rgba(255,255,255,0.36)',
              lineHeight:1.65, maxWidth:270,
            }}>
              Not &ldquo;restaurants near me&rdquo; —<br/>
              how do you <em style={{ color:'rgba(255,255,255,0.58)', fontStyle:'italic' }}>feel</em> today?
            </p>
          </div>

          <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'28px 0' }}/>
        </div>

        {/* ── VIBE CARDS SCROLL ── */}
        <div style={{ paddingLeft:24, paddingRight:24, opacity: loaded ? 1 : 0, transition:'opacity 0.6s ease 0.28s' }}>
          <div className="hscroll">
            {vibes.map((v, i) => (
              <div
                key={v.id}
                className={`vcard ${active === v.id ? 'sel' : ''}`}
                onClick={() => setActive(active === v.id ? null : v.id)}
                onMouseEnter={() => setHovered(v.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width:148, height:196,
                  background: active === v.id ? v.bgGrad : 'linear-gradient(135deg,#181512 0%,#111009 100%)',
                  border: active === v.id
                    ? `1px solid ${v.border}`
                    : hovered === v.id
                      ? '1px solid rgba(255,255,255,0.14)'
                      : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: active === v.id ? `0 14px 44px ${v.accent}` : 'none',
                }}
              >
                {/* BG photo */}
                <div style={{
                  position:'absolute', inset:0,
                  backgroundImage:`url('${v.img}')`,
                  backgroundSize:'cover', backgroundPosition:'center',
                  opacity: active === v.id ? 0.13 : hovered === v.id ? 0.07 : 0.04,
                  transition:'opacity 0.32s', filter:'grayscale(30%)',
                }}/>
                <div style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.05) 65%)',
                }}/>

                {/* Active top bar */}
                {active === v.id && (
                  <div style={{
                    position:'absolute', top:0, left:0, right:0, height:2,
                    background:`linear-gradient(90deg, transparent, ${v.color}, transparent)`,
                  }}/>
                )}

                <div style={{
                  position:'absolute', inset:0,
                  display:'flex', flexDirection:'column',
                  justifyContent:'space-between', padding:14,
                }}>
                  {/* Icon top-left, check top-right */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ opacity: active === v.id ? 1 : 0.6, transition:'opacity 0.22s' }}>
                      {v.icon(active === v.id ? v.color : 'rgba(255,255,255,0.55)')}
                    </div>
                    {active === v.id && (
                      <div style={{
                        width:18, height:18, borderRadius:'50%',
                        background:v.color, display:'flex',
                        alignItems:'center', justifyContent:'center',
                      }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Bottom label */}
                  <div>
                    <div style={{
                      fontSize:8.5, letterSpacing:'0.2em', textTransform:'uppercase',
                      fontWeight:700, color: active === v.id ? v.color : 'rgba(255,255,255,0.3)',
                      marginBottom:5, transition:'color 0.22s',
                    }}>{v.mood}</div>
                    <div style={{
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:21, letterSpacing:'0.04em',
                      color:'#fff', lineHeight:1, marginBottom:4,
                    }}>{v.label}</div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.28)', letterSpacing:'0.07em' }}>{v.count}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        {activeVibe && (
          <div
            className="panel"
            style={{
              margin:'18px 24px 0',
              borderRadius:18, padding:20,
              background: activeVibe.bgGrad,
              border:`1px solid ${activeVibe.border}`,
              boxShadow:`0 20px 60px ${activeVibe.accent}`,
              position:'relative', overflow:'hidden',
            }}
          >
            <div style={{
              position:'absolute', inset:0,
              backgroundImage:`url('${activeVibe.img}')`,
              backgroundSize:'cover', backgroundPosition:'center',
              opacity:0.07, filter:'grayscale(20%)',
            }}/>
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 100%)',
            }}/>

            <div style={{ position:'relative', zIndex:1 }}>

              {/* Panel header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{
                    width:40, height:40, borderRadius:10,
                    background: activeVibe.accent,
                    border:`1px solid ${activeVibe.border}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink:0,
                  }}>
                    {activeVibe.icon(activeVibe.color)}
                  </div>
                  <div>
                    <div style={{
                      fontSize:8.5, letterSpacing:'0.2em', textTransform:'uppercase',
                      fontWeight:700, color:activeVibe.color, marginBottom:4,
                    }}>{activeVibe.mood} mode</div>
                    <div style={{
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:28, color:'#fff', letterSpacing:'0.03em', lineHeight:1,
                    }}>{activeVibe.label}</div>
                  </div>
                </div>
                <button
                  onClick={() => setActive(null)}
                  style={{
                    width:28, height:28, borderRadius:'50%',
                    background:'rgba(255,255,255,0.07)',
                    border:'1px solid rgba(255,255,255,0.1)',
                    color:'rgba(255,255,255,0.45)',
                    fontSize:16, cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <p style={{
                fontSize:12.5, color:'rgba(255,255,255,0.42)',
                lineHeight:1.55, marginBottom:16,
              }}>{activeVibe.tagline}</p>

              {/* Tags */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:20 }}>
                {activeVibe.tags.map(tag => (
                  <span key={tag} className="pill" style={{
                    background: activeVibe.accent,
                    borderColor: activeVibe.border,
                    color: activeVibe.color,
                  }}>{tag}</span>
                ))}
              </div>

              {/* Top picks */}
              <div style={{
                fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase',
                color:'rgba(255,255,255,0.22)', marginBottom:10,
              }}>Top Picks</div>

              <div className="hscroll" style={{ marginBottom:18 }}>
                {mockPlaces.map((p, i) => (
                  <div key={i} className="pcard" style={{ width:138 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = activeVibe.border}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                  >
                    <div style={{
                      height:75,
                      background:`linear-gradient(135deg, ${activeVibe.accent} 0%, rgba(0,0,0,0.5) 100%)`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      position:'relative',
                    }}>
                      <div style={{ opacity:0.6 }}>{activeVibe.icon(activeVibe.color)}</div>
                      <div style={{
                        position:'absolute', top:6, right:7,
                        background:'rgba(0,0,0,0.65)',
                        borderRadius:100, padding:'2px 7px',
                        fontSize:9, color:'rgba(255,200,50,0.9)',
                        fontWeight:600, letterSpacing:'0.04em',
                        display:'flex', alignItems:'center', gap:4,
                      }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="rgba(255,200,50,0.9)">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {p.rating}
                      </div>
                    </div>
                    <div style={{ padding:'8px 10px' }}>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,0.28)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:3 }}>{p.area}</div>
                      <div style={{
                        fontFamily:"'Bebas Neue',sans-serif",
                        fontSize:14, color:'#fff', letterSpacing:'0.04em',
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom:3,
                      }}>{p.name}</div>
                      <div style={{ fontSize:10, color:activeVibe.color, fontWeight:600, letterSpacing:'0.04em' }}>&#8377; {p.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                className="cta-btn"
                onClick={() => window.location.href = `/${activeVibe.id}`}
                style={{
                  background: activeVibe.color, color:'#000',
                  boxShadow:`0 6px 24px ${activeVibe.accent}`,
                }}
              >
                Explore All {activeVibe.label} Spots
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Tap hint */}
        {!active && loaded && (
          <div style={{
            textAlign:'center', marginTop:18,
            fontSize:10, letterSpacing:'0.16em',
            color:'rgba(255,255,255,0.18)', textTransform:'uppercase',
          }}>Tap a vibe to explore</div>
        )}

        {/* ── ALL VIBES GRID ── */}
        <div style={{
          padding:'32px 24px 48px',
          opacity: loaded ? 1 : 0, transition:'opacity 0.7s ease 0.45s',
        }}>
          <div style={{
            fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.2)', marginBottom:14,
          }}>All Vibes</div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:9 }}>
            {vibes.map((v) => (
              <div
                key={v.id}
                className="gbox"
                onClick={() => {
                  setActive(v.id);
                  window.scrollTo({ top: 240, behavior:'smooth' });
                }}
                style={{
                  height:78,
                  background: active === v.id ? v.accent : 'rgba(255,255,255,0.03)',
                  border: active === v.id
                    ? `1px solid ${v.border}`
                    : '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  if(active !== v.id){
                    e.currentTarget.style.background='rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor='rgba(255,255,255,0.13)';
                  }
                }}
                onMouseLeave={e => {
                  if(active !== v.id){
                    e.currentTarget.style.background='rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';
                  }
                }}
              >
                <div style={{ opacity: active === v.id ? 1 : 0.5, transition:'opacity 0.22s' }}>
                  {v.icon(active === v.id ? v.color : 'rgba(255,255,255,0.5)')}
                </div>
                <span style={{
                  fontSize:8, letterSpacing:'0.1em', textTransform:'uppercase',
                  fontWeight:600, textAlign:'center',
                  color: active === v.id ? v.color : 'rgba(255,255,255,0.32)',
                  transition:'color 0.22s',
                }}>{v.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* X AI strip */}
          <div
            onClick={() => window.location.href='/ai-agent'}
            style={{
              marginTop:20, borderRadius:14, padding:'15px 18px',
              background:'rgba(255,107,0,0.06)',
              border:'1px solid rgba(255,107,0,0.16)',
              display:'flex', alignItems:'center', gap:14, cursor:'pointer',
              transition:'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,107,0,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,107,0,0.16)'}
          >
            <div style={{
              width:40, height:40, borderRadius:10, flexShrink:0,
              background:'rgba(255,107,0,0.12)',
              border:'1px solid rgba(255,107,0,0.25)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.7">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
                <path d="M12 8v4l3 3"/>
                <circle cx="12" cy="12" r="1" fill="#FF6B00"/>
              </svg>
            </div>
            <div style={{ flex:1 }}>
              <div style={{
                fontSize:12, fontWeight:700, color:'#fff',
                letterSpacing:'0.03em', marginBottom:3,
              }}>Not sure which vibe?</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.32)' }}>
                Tell X AI how you feel — it will plan everything
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,107,0,0.6)" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>

      </div>

      {/* MOBILE BOTTOM NAV */}
{isMobile && (
  <div style={{
    position: 'fixed', bottom: 0, left: 0, right: 0,
    height: 64, background: '#0f0d0b',
    borderTop: '0.5px solid rgba(255,255,255,0.08)',
    zIndex: 999, display: 'flex',
    alignItems: 'center', justifyContent: 'space-around',
    padding: '0 8px',
  }}>
    {[
      { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: 'Home', href: '/' },
      { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, label: 'Explore', href: '/#explore' },
      { icon: null, label: 'AI', href: '/ai-agent', isCenter: true },
      { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: 'Bookings', href: '/userbooking' },
      { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Profile', href: '/auth' },
    ].map((btn, i) => (
      <a key={i} href={btn.href} style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4,
        color: btn.label === 'Vibes' ? '#FF6B00' : 'rgba(255,255,255,0.4)',
        textDecoration: 'none', padding: '8px 12px',
        marginTop: btn.isCenter ? -20 : 0,
      }}>
        {btn.isCenter ? (
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#FF6B00',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255,107,0,0.5)',
            border: '3px solid #0f0d0b',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 22, color: '#fff',
          }}>X</div>
        ) : btn.icon}
        <span style={{ fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{btn.label}</span>
      </a>
    ))}
  </div>
)}
    </div>
  );
}