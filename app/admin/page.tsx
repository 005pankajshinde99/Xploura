 'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authTab, setAuthTab] = useState('login');
  const [dashTab, setDashTab] = useState('add');
  const [loginForm, setLoginForm] = useState({ email: '', pass: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', pass: '' });
  const [authErr, setAuthErr] = useState('');
  const [authSuc, setAuthSuc] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [form, setForm] = useState({ name:'', cat:'', area:'', price:'', rating:'', timings:'', whatsapp:'', img:'', desc:'' });
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState('');

  useEffect(() => {
    _supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user && dashTab === 'bookings') loadBookings();
      if (session?.user && dashTab === 'listings') loadListings();
    });
  }, []);

  async function login() {
    setAuthErr('');
    const { error } = await _supabase.auth.signInWithPassword({ email: loginForm.email, password: loginForm.pass });
    if (error) setAuthErr(error.message);
  }

  async function signup() {
    setAuthErr(''); setAuthSuc('');
    if (signupForm.pass.length < 6) { setAuthErr('Password must be 6+ characters'); return; }
    const { error } = await _supabase.auth.signUp({ email: signupForm.email, password: signupForm.pass, options: { data: { full_name: signupForm.name } } });
    if (error) setAuthErr(error.message);
    else setAuthSuc('Account created! Check your email to verify.');
  }

  async function logout() { await _supabase.auth.signOut(); }

  async function loadListings() {
    const { data } = await _supabase.from('cafes').select('*').eq('owner_id', user?.id).order('created_at', { ascending: false });
    setListings(data || []);
  }

  async function loadBookings() {
    const { data: cafes } = await _supabase.from('cafes').select('name').eq('owner_id', user?.id);
    if (!cafes?.length) { setBookings([]); return; }
    const { data } = await _supabase.from('bookings').select('*').in('cafe_name', cafes.map(c => c.name)).order('created_at', { ascending: false });
    setBookings(data || []);
  }

  async function addListing() {
    setFormMsg(''); setFormErr('');
    if (!form.name || !form.cat || !form.area) { setFormErr('Name, Category aur Area zaroori hai!'); return; }
    setSaving(true);
    const { error } = await _supabase.from('cafes').insert({
      name: form.name, category: form.cat, area: form.area, price: form.price,
      rating: parseFloat(form.rating) || null, timings: form.timings,
      whatsapp: form.whatsapp, image_url: form.img, description: form.desc,
      owner_id: user?.id, owner_email: user?.email,
    });
    setSaving(false);
    if (error) setFormErr(error.message);
    else { setFormMsg('✅ Listing add ho gayi! Xploura pe visible hai.'); setForm({ name:'', cat:'', area:'', price:'', rating:'', timings:'', whatsapp:'', img:'', desc:'' }); setPreviewImg(''); }
  }

  async function deleteListing(id: string) {
    if (!confirm('Delete this listing?')) return;
    await _supabase.from('cafes').delete().eq('id', id);
    loadListings();
  }

  async function confirmBooking(id: string) {
    await _supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id);
    loadBookings();
  }

  // ── AUTH PAGE ──
  if (!user) return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; }
        .finput { width:100%; padding:12px 16px; background:rgba(255,255,255,0.05); border:0.5px solid rgba(255,255,255,0.1); border-radius:8px; font-size:14px; color:#fff; outline:none; font-family:'DM Sans',sans-serif; margin-bottom:16px; }
        .finput::placeholder { color:rgba(255,255,255,0.2); }
        .finput:focus { border-color:#FF6B00; }
      `}</style>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#000' }}>
        <div style={{ width:'100%', maxWidth:420, padding:48, background:'#111', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:16 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, letterSpacing:'0.14em', color:'#FF6B00', marginBottom:8 }}>Xploura</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:36 }}>Owner Portal</div>

          {/* TABS */}
          <div style={{ display:'flex', marginBottom:28, border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:8, overflow:'hidden' }}>
            {['login','signup'].map(t => (
              <button key={t} onClick={() => setAuthTab(t)} style={{ flex:1, padding:10, fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', border:'none', fontFamily:"'DM Sans',sans-serif", background: authTab===t ? '#FF6B00' : 'transparent', color: authTab===t ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                {t === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {authTab === 'login' ? (
            <>
              <input className="finput" type="email" placeholder="your@email.com" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email:e.target.value})} />
              <input className="finput" type="password" placeholder="••••••••" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass:e.target.value})} onKeyDown={e => e.key==='Enter' && login()} />
              <button onClick={login} style={{ width:'100%', padding:14, background:'#FF6B00', color:'#fff', border:'none', borderRadius:8, fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", fontWeight:500, cursor:'pointer' }}>Login</button>
            </>
          ) : (
            <>
              <input className="finput" type="text" placeholder="Your Name" value={signupForm.name} onChange={e => setSignupForm({...signupForm, name:e.target.value})} />
              <input className="finput" type="email" placeholder="your@email.com" value={signupForm.email} onChange={e => setSignupForm({...signupForm, email:e.target.value})} />
              <input className="finput" type="password" placeholder="Min 6 characters" value={signupForm.pass} onChange={e => setSignupForm({...signupForm, pass:e.target.value})} />
              <button onClick={signup} style={{ width:'100%', padding:14, background:'#FF6B00', color:'#fff', border:'none', borderRadius:8, fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", fontWeight:500, cursor:'pointer' }}>Create Account</button>
            </>
          )}
          {authErr && <div style={{ color:'#ff4444', fontSize:12, marginTop:10, textAlign:'center' }}>{authErr}</div>}
          {authSuc && <div style={{ color:'#44ff88', fontSize:12, marginTop:10, textAlign:'center' }}>{authSuc}</div>}
        </div>
      </div>
    </>
  );

  // ── DASHBOARD ──
  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; background:#FAFAF8; }
        .dinput { width:100%; padding:12px 16px; border:1px solid rgba(0,0,0,0.1); border-radius:8px; font-size:14px; color:#000; outline:none; font-family:'DM Sans',sans-serif; background:#fff; }
        .dinput:focus { border-color:#FF6B00; }
        .dinput::placeholder { color:rgba(0,0,0,0.25); }
        @media(max-width:768px) { .form-grid { grid-template-columns:1fr !important; } .listings-grid { grid-template-columns:1fr !important; } }
      `}</style>

      {/* NAV */}
      <nav style={{ background:'#000', padding:'18px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:'0.14em', color:'#FF6B00' }}>Xploura Admin</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{user.email}</div>
          <button onClick={logout} style={{ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', background:'transparent', border:'0.5px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.4)', padding:'8px 16px', borderRadius:20, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding:'40px 32px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42, letterSpacing:'0.04em', marginBottom:6 }}>Welcome Back</div>
        <div style={{ fontSize:13, color:'rgba(0,0,0,0.4)', marginBottom:36 }}>Manage your listings and bookings</div>

        {/* TABS */}
        <div style={{ display:'flex', gap:8, marginBottom:32 }}>
          {[{id:'bookings',l:'Bookings'},{id:'listings',l:'My Listings'},{id:'add',l:'+ Add Listing'}].map(t => (
            <button key={t.id} onClick={() => { setDashTab(t.id); if(t.id==='listings') loadListings(); if(t.id==='bookings') loadBookings(); }}
              style={{ padding:'10px 24px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:24, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", background: dashTab===t.id ? '#FF6B00' : '#fff', color: dashTab===t.id ? '#fff' : 'rgba(0,0,0,0.4)', borderColor: dashTab===t.id ? '#FF6B00' : 'rgba(0,0,0,0.1)' }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* ADD LISTING */}
        {dashTab === 'add' && (
          <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:16, padding:32, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:'0.06em', marginBottom:24 }}>Add New Listing</div>
            <div className="form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
              {[
                {id:'name', label:'Name *', ph:'Cafe / Restaurant name'},
                {id:'area', label:'Area / Location *', ph:'Koregaon Park, Baner...'},
                {id:'price', label:'Price', ph:'₹500 avg / From ₹2,500'},
                {id:'rating', label:'Rating', ph:'4.5', type:'number'},
                {id:'timings', label:'Timings', ph:'9AM - 10PM'},
                {id:'whatsapp', label:'WhatsApp', ph:'9XXXXXXXXX'},
                {id:'img', label:'Photo URL', ph:'Google Maps photo URL'},
              ].map(f => (
                <div key={f.id} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.75)', fontWeight:600 }}>{f.label}</label>
                  <input className="dinput" type={f.type||'text'} placeholder={f.ph} value={(form as any)[f.id]}
                    onChange={e => { setForm({...form, [f.id]:e.target.value}); if(f.id==='img') setPreviewImg(e.target.value); }} />
                </div>
              ))}
              {/* CATEGORY */}
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.75)', fontWeight:600 }}>Category *</label>
                <select className="dinput" value={form.cat} onChange={e => setForm({...form, cat:e.target.value})}>
                  <option value="">Select category</option>
                  <option value="cafe">Cafe</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="travel">Travel / Trip</option>
                  <option value="adventure">Adventure</option>
                  <option value="date">Date Spot</option>
                </select>
              </div>
              {/* DESC */}
              <div style={{ display:'flex', flexDirection:'column', gap:6, gridColumn:'1/-1' }}>
                <label style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.75)', fontWeight:600 }}>Description</label>
                <textarea className="dinput" placeholder="Tell customers about your place..." value={form.desc} onChange={e => setForm({...form, desc:e.target.value})} style={{ resize:'vertical', minHeight:90 }} />
              </div>
              {/* PREVIEW */}
              {previewImg && (
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(0,0,0,0.75)', fontWeight:600, display:'block', marginBottom:8 }}>Photo Preview</label>
                  <img src={previewImg} style={{ width:'100%', height:160, objectFit:'cover', borderRadius:8, border:'1px solid rgba(0,0,0,0.08)' }} />
                </div>
              )}
            </div>
            <button onClick={addListing} disabled={saving} style={{ marginTop:24, padding:'14px 36px', background:'#FF6B00', color:'#fff', border:'none', borderRadius:8, fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", fontWeight:500, cursor:'pointer', opacity: saving ? 0.5 : 1 }}>
              {saving ? 'Saving...' : 'Save Listing'}
            </button>
            {formMsg && <div style={{ color:'#22c55e', fontSize:13, marginTop:12 }}>{formMsg}</div>}
            {formErr && <div style={{ color:'#ef4444', fontSize:13, marginTop:12 }}>{formErr}</div>}
          </div>
        )}

        {/* MY LISTINGS */}
        {dashTab === 'listings' && (
          <div>
            {listings.length === 0 ? (
              <div style={{ textAlign:'center', padding:60, color:'rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🏪</div>
                <div>No listings yet — add your first one!</div>
              </div>
            ) : (
              <div className="listings-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                {listings.map(d => (
                  <div key={d.id} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                    {d.image_url ? <img src={d.image_url} style={{ width:'100%', height:160, objectFit:'cover' }} /> : <div style={{ width:'100%', height:160, background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(0,0,0,0.25)' }}>No Photo</div>}
                    <div style={{ padding:16 }}>
                      <div style={{ fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'#FF6B00', marginBottom:4 }}>{d.category}</div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:'0.06em', marginBottom:4 }}>{d.name}</div>
                      <div style={{ fontSize:11, color:'rgba(0,0,0,0.4)', marginBottom:12 }}>📍 {d.area} · {d.price}</div>
                      <button onClick={() => deleteListing(d.id)} style={{ width:'100%', padding:8, border:'1px solid rgba(0,0,0,0.1)', borderRadius:6, fontSize:11, cursor:'pointer', background:'transparent', color:'rgba(0,0,0,0.5)', fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {dashTab === 'bookings' && (
          <div style={{ overflowX:'auto' }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign:'center', padding:60, color:'rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
                <div>No bookings yet</div>
              </div>
            ) : (
              <table style={{ width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                <thead>
                  <tr>
                    {['Cafe','Customer','Phone','Date','Time','Guests','Status','Action'].map(h => (
                      <th key={h} style={{ padding:'14px 18px', textAlign:'left', fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(0,0,0,0.4)', borderBottom:'1px solid rgba(0,0,0,0.06)', background:'#fafafa' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      {[b.cafe_name, b.customer_name, b.customer_phone, b.date, b.time, b.guests].map((v,i) => (
                        <td key={i} style={{ padding:'14px 18px', fontSize:13, borderBottom:'1px solid rgba(0,0,0,0.04)' }}>{v||'—'}</td>
                      ))}
                      <td style={{ padding:'14px 18px', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                        <span style={{ padding:'3px 10px', borderRadius:12, fontSize:10, fontWeight:600, background: b.status==='confirmed' ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,0,0.1)', color: b.status==='confirmed' ? '#16a34a' : '#FF6B00' }}>{b.status||'pending'}</span>
                      </td>
                      <td style={{ padding:'14px 18px', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                        {b.status === 'pending' && <button onClick={() => confirmBooking(b.id)} style={{ padding:'5px 12px', background:'#FF6B00', color:'#fff', border:'none', borderRadius:6, fontSize:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Confirm</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
}
