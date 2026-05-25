'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingPage() {
  const [place, setPlace] = useState<any>({});
  const [bookType, setBookType] = useState('book');
  const [form, setForm] = useState({ name:'', phone:'', date:'', time:'', guests:'2', note:'' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    try { setPlace(JSON.parse(decodeURIComponent(params.get('data') || '{}'))); } catch(e) {}
  }, []);

  async function submitBooking() {
    if (!form.name || !form.phone) { alert('Name aur phone zaroori hai!'); return; }
    setLoading(true);
    const { error } = await _supabase.from('bookings').insert({
      cafe_name: place.name, customer_name: form.name, customer_phone: form.phone,
      date: form.date, time: form.time, guests: parseInt(form.guests) || 1,
      status: 'pending', note: form.note, type: bookType,
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

  const crowd = place.rating >= 4.8 ? '🔴 High' : place.rating >= 4.5 ? '🟡 Medium' : '🟢 Low';

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; background:#FAFAF8; color:#000; }
        .bnav { background:#000; padding:18px 32px; display:flex; align-items:center; justify-content:space-between; }
        .bhero { position:relative; height:320px; overflow:hidden; background:#111; }
        .bhero img { width:100%; height:100%; object-fit:cover; }
        .bhero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.75)); }
        .bhero-content { position:absolute; bottom:0; left:0; right:0; padding:32px; }
        .stats-row { display:grid; grid-template-columns:repeat(4,1fr); background:#000; }
        .stat-box { padding:20px 24px; border-right:0.5px solid rgba(255,255,255,0.06); }
        .stat-label { font-size:9px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:6px; }
        .stat-val { font-size:18px; font-weight:600; color:#fff; }
        .bbody { max-width:800px; margin:0 auto; padding:40px 24px; }
        .card { background:#fff; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:24px; margin-bottom:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
        .btabs { display:flex; gap:10px; margin-bottom:24px; }
        .btab { flex:1; padding:16px; border-radius:12px; border:1.5px solid rgba(0,0,0,0.1); background:#fff; cursor:pointer; text-align:center; transition:all 0.3s; }
        .btab.active { border-color:#FF6B00; background:rgba(255,107,0,0.04); }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
        .finput { width:100%; padding:13px 16px; border:1px solid rgba(0,0,0,0.12); border-radius:10px; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s; }
        .finput:focus { border-color:#FF6B00; }
        .fsubmit { width:100%; padding:15px; background:#FF6B00; color:#fff; border:none; border-radius:10px; font-size:13px; letter-spacing:0.12em; text-transform:uppercase; font-family:'DM Sans',sans-serif; font-weight:600; cursor:pointer; margin-top:6px; }
        .fsubmit:hover { background:#FF8C35; }
        .dbgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px; }
        .dbitem { padding:14px 10px; border:1px solid rgba(0,0,0,0.08); border-radius:10px; text-align:center; background:#fafafa; }
        @media(max-width:600px) {
          .stats-row { grid-template-columns:repeat(2,1fr); }
          .form-grid { grid-template-columns:1fr; }
          .btabs { flex-direction:column; }
          .dbgrid { grid-template-columns:repeat(2,1fr); }
          .bnav { padding:14px 16px; }
          .bbody { padding:24px 16px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="bnav">
        <a href="/" style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:'0.14em', color:'#FF6B00', textDecoration:'none'}}>Xploura</a>
        <a href="/" style={{fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', textDecoration:'none', border:'0.5px solid rgba(255,255,255,0.15)', padding:'8px 16px', borderRadius:20}}>← Back</a>
      </nav>

      {/* HERO */}
      <div className="bhero">
        {place.image_url && <img src={place.image_url} alt={place.name} />}
        <div className="bhero-overlay" />
        <div className="bhero-content">
          <div style={{fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'#FF6B00', marginBottom:8, fontWeight:500}}>{place.category}</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:'#fff', letterSpacing:'0.04em', lineHeight:1}}>{place.name || 'Loading...'}</div>
          <div style={{fontSize:14, color:'rgba(255,255,255,0.6)', marginTop:6}}>📍 {place.area}</div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        {[
          {l:'⭐ Rating', v:`${place.rating || '—'} / 5`},
          {l:'💰 Price', v:place.price || '—'},
          {l:'🕐 Timings', v:place.timings || '—'},
          {l:'👥 Crowd', v:crowd},
        ].map((s,i) => (
          <div key={i} className="stat-box">
            <div className="stat-label">{s.l}</div>
            <div className="stat-val">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="bbody">
        {/* DESC */}
        <div className="card">
          <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:'0.06em', marginBottom:10}}>About This Place</div>
          <div style={{fontSize:14, color:'rgba(0,0,0,0.5)', lineHeight:1.8}}>{place.description || 'A premium experience awaits you in Pune.'}</div>
        </div>

        {success ? (
          /* SUCCESS */
          <div className="card" style={{textAlign:'center', padding:60}}>
            <div style={{fontSize:64, marginBottom:20}}>🎉</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:42, letterSpacing:'0.04em', marginBottom:10}}>Booking Confirmed!</div>
            <div style={{fontSize:15, color:'rgba(0,0,0,0.45)', lineHeight:1.7, marginBottom:28}}>Your booking has been received.<br/>The venue will contact you shortly.</div>
            <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
              <a href="/" style={{padding:'13px 28px', borderRadius:10, fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600, background:'#FF6B00', color:'#fff', textDecoration:'none'}}>Explore More</a>
              {place.whatsapp && (
                <a href={`https://wa.me/91${place.whatsapp}`} target="_blank" style={{padding:'13px 28px', borderRadius:10, fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600, background:'transparent', color:'#000', border:'1.5px solid rgba(0,0,0,0.15)', textDecoration:'none'}}>WhatsApp Venue</a>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* TABS */}
            <div className="btabs">
              {[
                {type:'book', icon:'📅', title:'Book Table', sub:'Reserve your spot'},
                ...(place.category === 'date' ? [{type:'date', icon:'💑', title:'Order Date Box', sub:'Premium date experience'}] : []),
                {type:'wa', icon:'💬', title:'WhatsApp', sub:'Chat directly'},
              ].map((t) => (
                <div key={t.type} className={`btab${bookType === t.type ? ' active' : ''}`}
                  onClick={() => t.type === 'wa' ? (place.whatsapp ? window.open(`https://wa.me/91${place.whatsapp}`) : alert('Not available')) : setBookType(t.type)}>
                  <div style={{fontSize:24, marginBottom:6}}>{t.icon}</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:'0.06em'}}>{t.title}</div>
                  <div style={{fontSize:11, color:'rgba(0,0,0,0.35)', marginTop:2}}>{t.sub}</div>
                </div>
              ))}
            </div>

            {/* FORM */}
            <div className="card">
              <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:'0.06em', marginBottom:20}}>
                {bookType === 'date' ? 'Order Your Date Box 💑' : 'Book Your Table 📅'}
              </div>

              {bookType === 'date' && (
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:13, fontWeight:600, marginBottom:12}}>What's included 🎁</div>
                  <div className="dbgrid">
                    {[['🕯️','Scented Candle'],['🍫','Chocolates'],['💌','Handwritten Note'],['🌸','Mini Flowers'],['🎵','Spotify Playlist'],['🎴','Couple Cards']].map(([icon,name]) => (
                      <div key={name} className="dbitem">
                        <div style={{fontSize:22, marginBottom:4}}>{icon}</div>
                        <div style={{fontSize:11, color:'rgba(0,0,0,0.5)'}}>{name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-grid">
                <input className="finput" placeholder="Your Full Name *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                <input className="finput" placeholder="Phone Number *" type="tel" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
                <input className="finput" type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} />
                <input className="finput" placeholder="Preferred Time (e.g. 7 PM)" value={form.time} onChange={e => setForm({...form, time:e.target.value})} />
                <input className="finput" placeholder="No. of Guests" type="number" value={form.guests} onChange={e => setForm({...form, guests:e.target.value})} />
                <input className="finput" placeholder="Special Note (optional)" value={form.note} onChange={e => setForm({...form, note:e.target.value})} />
              </div>
              <button className="fsubmit" onClick={submitBooking} disabled={loading}>
                {loading ? 'Saving...' : bookType === 'date' ? '💑 Order Date Box' : '📅 Confirm Booking'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}