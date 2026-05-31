'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingPage() {
  const [place, setPlace] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [bookType, setBookType] = useState('book');
  const [form, setForm] = useState({ name:'', phone:'', date:'', time:'', guests:'2', note:'' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    _supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    try { setPlace(JSON.parse(decodeURIComponent(params.get('data') || '{}'))); } catch(e) {}
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css';
    document.head.appendChild(link1);
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Bebas+Neue&display=swap';
    document.head.appendChild(link2);
  }, []);

  async function submitBooking() {
    if (!form.name || !form.phone) { alert('Name aur phone zaroori hai!'); return; }
    setLoading(true);
    const { error } = await _supabase.from('bookings').insert({
      cafe_name: place.name, customer_name: form.name, customer_phone: form.phone,
      date: form.date, time: form.time, guests: parseInt(form.guests) || 1,
      status: 'pending', note: form.note, type: bookType,
      user_id: user?.id || null,
    });
    setLoading(false);
    if (!error) {
      setSuccess(true);
      if (place.whatsapp) {
        const msg = bookType === 'date'
          ? `🎁 Date Box!\nVenue: ${place.name}\nFrom: ${form.name}\nPhone: ${form.phone}\nDate: ${form.date} ${form.time}`
          : `📅 Booking!\nVenue: ${place.name}\nFrom: ${form.name}\nPhone: ${form.phone}\nDate: ${form.date} ${form.time}\nGuests: ${form.guests}`;
        window.open(`https://wa.me/91${place.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
      }
    } else { alert('Error: ' + error.message); }
  }

  const crowdLevel = place.rating >= 4.8 ? 'High' : place.rating >= 4.5 ? 'Medium' : 'Low';
  const crowdColor = place.rating >= 4.8 ? '#FF4444' : place.rating >= 4.5 ? '#FFAA00' : '#22C55E';

  if (!place.name) return (
    <div style={{minHeight:'100vh',background:'#F5F4F0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{textAlign:'center',color:'rgba(0,0,0,0.25)'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:'0.06em',marginBottom:8}}>Loading...</div>
        <div style={{fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase'}}>Fetching place details</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; background:#F5F4F0; color:#0A0A0A; }
        .bnav { background:#0A0A0A; padding:0 20px; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; border-bottom:0.5px solid rgba(255,255,255,0.06); }
        .bnav-logo { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:0.16em; color:#FF6B00; text-decoration:none; }
        .bnav-back { display:flex; align-items:center; gap:6px; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.35); text-decoration:none; border:0.5px solid rgba(255,255,255,0.12); padding:7px 16px; border-radius:20px; transition:all 0.2s; }
        .bnav-back:hover { color:rgba(255,255,255,0.7); border-color:rgba(255,255,255,0.25); }
        .bhero { position:relative; height:260px; overflow:hidden; background:#111; max-width:900px; margin:0 auto; border-radius:12px; }
        .bhero img { width:100%; height:100%; object-fit:cover; }
        .bhero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%); }
        .bhero-content { position:absolute; bottom:0; left:0; right:0; padding:36px 20px; }
        .bhero-badge { display:inline-flex; align-items:center; gap:5px; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:#FF6B00; font-weight:600; background:rgba(255,107,0,0.12); border:0.5px solid rgba(255,107,0,0.3); padding:5px 12px; border-radius:20px; margin-bottom:12px; }
        .bhero-name { font-family:'Bebas Neue',sans-serif; font-size:42px; color:#fff; letter-spacing:0.03em; line-height:1; margin-bottom:8px; }
        .bhero-loc { display:flex; align-items:center; gap:6px; font-size:13px; color:rgba(255,255,255,0.5); }
        .stats-row { display:grid; grid-template-columns:repeat(4,1fr); background:#0A0A0A; max-width:900px; margin:0 auto; }
        .stat-box { padding:22px 16px; border-right:0.5px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; gap:6px; }
        .stat-box:last-child { border-right:none; }
        .stat-icon-label { display:flex; align-items:center; gap:7px; }
        .stat-icon-label i { font-size:13px; color:rgba(255,255,255,0.25); }
        .stat-label { font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.25); }
        .stat-val { font-size:17px; font-weight:600; color:#fff; letter-spacing:0.01em; }
        .bbody { max-width:900px; margin:0 auto; padding:44px 24px; }
        .card { background:#fff; border:0.5px solid rgba(0,0,0,0.08); border-radius:18px; padding:28px; margin-bottom:20px; opacity:1 !important; transform:none !important; }
        .card-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:0.06em; margin-bottom:12px; display:flex; align-items:center; gap:10px; }
        .card-title i { font-size:20px; color:#FF6B00; }
        .btabs { display:flex; gap:10px; margin-bottom:20px; }
        .btab { flex:1; padding:18px 14px; border-radius:14px; border:0.5px solid rgba(0,0,0,0.1); background:#fff; cursor:pointer; text-align:center; transition:all 0.25s; position:relative; overflow:hidden; }
        .btab:hover { border-color:rgba(255,107,0,0.3); background:#FFFAF7; }
        .btab.active { border-color:#FF6B00; background:#FFFAF7; }
        .btab.active::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:#FF6B00; }
        .btab-icon { font-size:22px; margin-bottom:8px; color:#0A0A0A; }
        .btab.active .btab-icon { color:#FF6B00; }
        .btab-title { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:0.06em; color:#0A0A0A; }
        .btab-sub { font-size:10px; color:rgba(0,0,0,0.3); margin-top:2px; letter-spacing:0.04em; }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
        .finput-wrap { position:relative; }
        .finput-wrap i { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; color:rgba(0,0,0,0.25); pointer-events:none; }
        .finput { width:100%; padding:13px 16px 13px 40px; border:0.5px solid rgba(0,0,0,0.12); border-radius:11px; font-size:13.5px; font-family:'DM Sans',sans-serif; color:#0A0A0A; background:#FAFAF8; outline:none; transition:border-color 0.2s, background 0.2s; }
        .finput:focus { border-color:#FF6B00; background:#fff; }
        .finput::placeholder { color:rgba(0,0,0,0.3); }
        .fsubmit { width:100%; padding:15px; background:#FF6B00; color:#fff; border:none; border-radius:11px; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; font-family:'DM Sans',sans-serif; font-weight:600; cursor:pointer; margin-top:4px; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.2s, transform 0.1s; }
        .fsubmit:hover { background:#E55E00; }
        .fsubmit:active { transform:scale(0.99); }
        .fsubmit:disabled { opacity:0.6; cursor:not-allowed; }
        .fsubmit i { font-size:17px; }
        .dbgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:20px; }
        .dbitem { padding:16px 10px; border:0.5px solid rgba(0,0,0,0.07); border-radius:12px; text-align:center; background:#FAFAF8; transition:border-color 0.2s; }
        .dbitem:hover { border-color:rgba(255,107,0,0.25); }
        .dbitem i { font-size:22px; color:#FF6B00; margin-bottom:6px; display:block; }
        .dbitem-name { font-size:11px; color:rgba(0,0,0,0.45); letter-spacing:0.03em; }
        .success-wrap { text-align:center; padding:64px 24px; }
        .success-icon { width:72px; height:72px; border-radius:50%; background:rgba(255,107,0,0.08); border:0.5px solid rgba(255,107,0,0.2); display:flex; align-items:center; justify-content:center; margin:0 auto 24px; }
        .success-icon i { font-size:34px; color:#FF6B00; }
        .success-title { font-family:'Bebas Neue',sans-serif; font-size:44px; letter-spacing:0.04em; margin-bottom:10px; }
        .success-sub { font-size:14px; color:rgba(0,0,0,0.4); line-height:1.8; margin-bottom:32px; }
        .success-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .btn-primary { display:flex; align-items:center; gap:8px; padding:13px 28px; border-radius:10px; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; font-weight:600; font-family:'DM Sans',sans-serif; background:#FF6B00; color:#fff; text-decoration:none; transition:background 0.2s; }
        .btn-primary:hover { background:#E55E00; }
        .btn-outline { display:flex; align-items:center; gap:8px; padding:13px 28px; border-radius:10px; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; font-weight:600; font-family:'DM Sans',sans-serif; background:transparent; color:#0A0A0A; border:0.5px solid rgba(0,0,0,0.15); text-decoration:none; transition:all 0.2s; }
        .btn-outline:hover { border-color:rgba(0,0,0,0.3); }
        .about-text { font-size:14px; color:rgba(0,0,0,0.45); line-height:1.85; }
        .divider { height:0.5px; background:rgba(0,0,0,0.07); margin:16px 0; }
        .crowd-dot { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:6px; vertical-align:middle; }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @media(max-width:600px) {
          .stats-row { grid-template-columns:repeat(2,1fr); }
          .form-grid { grid-template-columns:1fr; }
          .btabs { flex-direction:column; }
          .dbgrid { grid-template-columns:repeat(2,1fr); }
          .bnav { padding:0 16px; }
          .bbody { padding:28px 16px; }
          .bhero-content { padding:24px 20px; }
          .bhero-name { font-size:32px; }
        }
      `}</style>

      <nav className="bnav">
        <a href="/" className="bnav-logo">Xploura</a>
        <a href="/" className="bnav-back">
          <i className="ti ti-arrow-left" style={{fontSize:13}}></i>
          Back
        </a>
      </nav>

      <div className="bhero">
        {place.image_url
          ? <img src={place.image_url} alt={place.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center center'}} />
          : <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#1a1410 0%,#2a1f15 50%,#0f0d0b 100%)'}} />
        }
        <div className="bhero-overlay" />
        <div className="bhero-content">
          <div className="bhero-badge">
            <i className="ti ti-tag" style={{fontSize:9}}></i>
            {place.category || 'Venue'}
          </div>
          <div className="bhero-name">{place.name || 'Loading...'}</div>
          <div className="bhero-loc">
            <i className="ti ti-map-pin" style={{fontSize:14, color:'rgba(255,255,255,0.4)'}}></i>
            {place.area || 'Pune'}
          </div>
        </div>
      </div>

      <div className="stats-row">
        {[
          { icon:'ti-star', label:'Rating', val:`${place.rating || '—'} / 5` },
          { icon:'ti-receipt-rupee', label:'Price', val: place.price || '—' },
          { icon:'ti-clock', label:'Timings', val: place.timings || '—' },
          { icon:'ti-users', label:'Crowd', val: crowdLevel, color: crowdColor },
        ].map((s, i) => (
          <div key={i} className="stat-box">
            <div className="stat-icon-label">
              <i className={`ti ${s.icon}`}></i>
              <span className="stat-label">{s.label}</span>
            </div>
            <div className="stat-val" style={s.color ? {color: s.color} : {}}>
              {s.color && <span className="crowd-dot" style={{background: s.color}}></span>}
              {s.val}
            </div>
          </div>
        ))}
      </div>

      <div className="bbody">
        <div className="card">
          <div className="card-title">
            <i className="ti ti-info-circle"></i>
            About This Place
          </div>
          <p className="about-text">{place.description || 'A premium experience awaits you in Pune.'}</p>
        </div>

        {success ? (
          <div className="card">
            <div className="success-wrap">
              <div className="success-icon"><i className="ti ti-check"></i></div>
              <div className="success-title">Booking Confirmed!</div>
              <p className="success-sub">Your booking has been received.<br />The venue will contact you shortly.</p>
              <div className="success-btns">
                <a href="/" className="btn-primary">
                  <i className="ti ti-compass" style={{fontSize:15}}></i>
                  Explore More
                </a>
                {place.whatsapp && (
                  <a href={`https://wa.me/91${place.whatsapp}`} target="_blank" className="btn-outline">
                    <i className="ti ti-brand-whatsapp" style={{fontSize:15}}></i>
                    WhatsApp Venue
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="btabs">
              {[
                {
                type:'book',
                icon: place.category === 'travel' ? 'ti-map-pin'
                     : place.category === 'adventure' ? 'ti-mountain'
                     : place.category === 'cafe' ? 'ti-coffee'
                     : 'ti-calendar-event',
                title: place.category === 'travel' ? 'Book Trip'
                      : place.category === 'adventure' ? 'Book Activity'
                      : place.category === 'cafe' ? 'Reserve Seat'
                      : place.category === 'restaurant' ? 'Reserve Table'
                      : 'Book Now',
                sub: place.category === 'travel' ? 'Plan your trip'
                   : place.category === 'adventure' ? 'Secure your slot'
                   : 'Reserve your spot'
              },
                ...(place.category === 'date' ? [{ type:'date', icon:'ti-heart', title:'Date Box', sub:'Premium experience' }] : []),
                { type:'wa', icon:'ti-brand-whatsapp', title:'WhatsApp', sub:'Chat directly' },
              ].map((t) => (
                <div key={t.type} className={`btab${bookType === t.type ? ' active' : ''}`}
                  onClick={() => t.type === 'wa'
                    ? (place.whatsapp ? window.open(`https://wa.me/91${place.whatsapp}`) : alert('Not available'))
                    : setBookType(t.type)
                  }>
                  <div className="btab-icon"><i className={`ti ${t.icon}`}></i></div>
                  <div className="btab-title">{t.title}</div>
                  <div className="btab-sub">{t.sub}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="card-title">
                <i className={`ti ${
                  bookType === 'date' ? 'ti-heart'
                  : place.category === 'travel' ? 'ti-map-pin'
                  : place.category === 'adventure' ? 'ti-mountain'
                  : place.category === 'cafe' ? 'ti-coffee'
                  : 'ti-calendar-plus'
                }`}></i>
                {bookType === 'date' ? 'Order Your Date Box'
                  : place.category === 'travel' ? 'Book Your Trip'
                  : place.category === 'adventure' ? 'Book Your Activity'
                  : place.category === 'cafe' ? 'Reserve Your Seat'
                  : place.category === 'restaurant' ? 'Reserve Your Table'
                  : 'Book Now'}
              </div>

              {bookType === 'date' && (
                <>
                  <p style={{fontSize:12, color:'rgba(0,0,0,0.35)', letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:12, fontWeight:500}}>What's Included</p>
                  <div className="dbgrid">
                    {[
                      ['ti-candle','Scented Candle'],['ti-cookie','Chocolates'],
                      ['ti-mail-heart','Handwritten Note'],['ti-flowers','Mini Flowers'],
                      ['ti-music','Spotify Playlist'],['ti-cards','Couple Cards'],
                    ].map(([icon, name]) => (
                      <div key={name} className="dbitem">
                        <i className={`ti ${icon}`}></i>
                        <div className="dbitem-name">{name}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divider"></div>
                </>
              )}

              <div className="form-grid">
                <div className="finput-wrap"><i className="ti ti-user"></i><input className="finput" placeholder="Your Full Name *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} /></div>
                <div className="finput-wrap"><i className="ti ti-phone"></i><input className="finput" placeholder="Phone Number *" type="tel" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} /></div>
                <div className="finput-wrap"><i className="ti ti-calendar"></i><input className="finput" type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} /></div>
                <div className="finput-wrap"><i className="ti ti-clock"></i><input className="finput" placeholder="Preferred Time (e.g. 7 PM)" value={form.time} onChange={e => setForm({...form, time:e.target.value})} /></div>
                <div className="finput-wrap"><i className="ti ti-users"></i><input className="finput" placeholder="No. of Guests" type="number" value={form.guests} onChange={e => setForm({...form, guests:e.target.value})} /></div>
                <div className="finput-wrap"><i className="ti ti-notes"></i><input className="finput" placeholder="Special Note (optional)" value={form.note} onChange={e => setForm({...form, note:e.target.value})} /></div>
              </div>

              <button className="fsubmit" onClick={submitBooking} disabled={loading}>
                {loading ? (
                  <><i className="ti ti-loader-2" style={{animation:'spin 1s linear infinite'}}></i> Saving...</>
                ) : bookType === 'date' ? (
                  <><i className="ti ti-heart"></i> Order Date Box</>
                ) : (
                  <><i className="ti ti-calendar-check"></i> Confirm Booking</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}