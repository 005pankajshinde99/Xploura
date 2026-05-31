'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EMPTY_FORM = { name:'', cat:'', area:'', price:'', rating:'', timings:'', whatsapp:'', desc:'' };

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authTab, setAuthTab] = useState('login');
  const [dashTab, setDashTab] = useState('add');
  const [loginForm, setLoginForm] = useState({ email:'', pass:'' });
  const [signupForm, setSignupForm] = useState({ name:'', email:'', pass:'' });
  const [authErr, setAuthErr] = useState('');
  const [authSuc, setAuthSuc] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ total:0, pending:0, confirmed:0 });

  // Add form
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [imgs, setImgs] = useState<string[]>([]);
  const [newImgUrl, setNewImgUrl] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');
  const [saving, setSaving] = useState(false);

  // Edit modal
  const [editItem, setEditItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });
  const [editImgs, setEditImgs] = useState<string[]>([]);
  const [editNewImg, setEditNewImg] = useState('');
  const [editMsg, setEditMsg] = useState('');
  const [editErr, setEditErr] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    _supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (user) { loadListings(); loadBookings(); }
  }, [user]);

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
    setStats(s => ({ ...s, total: (data||[]).length }));
  }

  async function loadBookings() {
    const { data: cafes } = await _supabase.from('cafes').select('name').eq('owner_id', user?.id);
    if (!cafes?.length) { setBookings([]); return; }
    const { data } = await _supabase.from('bookings').select('*').in('cafe_name', cafes.map(c => c.name)).order('created_at', { ascending: false });
    const bk = data || [];
    setBookings(bk);
    setStats(s => ({
      ...s,
      pending: bk.filter(b => b.status === 'pending').length,
      confirmed: bk.filter(b => b.status === 'confirmed').length,
    }));
  }

  // ── ADD ──
  function addPhoto() {
    if (!newImgUrl.trim() || imgs.length >= 8) return;
    setImgs([...imgs, newImgUrl.trim()]);
    setNewImgUrl('');
  }
  function removePhoto(idx: number) { setImgs(imgs.filter((_,i) => i !== idx)); }

  async function addListing() {
    setFormMsg(''); setFormErr('');
    if (!form.name || !form.cat || !form.area) { setFormErr('Name, Category aur Area zaroori hai!'); return; }
    setSaving(true);
    const { error } = await _supabase.from('cafes').insert({
      name: form.name, category: form.cat, area: form.area, price: form.price,
      rating: parseFloat(form.rating) || null, timings: form.timings,
      whatsapp: form.whatsapp, description: form.desc,
      image_url: imgs[0] || '',
      image_urls: imgs,
      owner_id: user?.id, owner_email: user?.email,
    });
    setSaving(false);
    if (error) setFormErr(error.message);
    else {
      setFormMsg('✅ Listing add ho gayi!');
      setForm({ ...EMPTY_FORM });
      setImgs([]);
      loadListings();
    }
  }

  // ── EDIT ──
  function openEdit(d: any) {
    setEditItem(d);
    setEditForm({ name: d.name||'', cat: d.category||'', area: d.area||'', price: d.price||'', rating: d.rating||'', timings: d.timings||'', whatsapp: d.whatsapp||'', desc: d.description||'' });
    setEditImgs(d.image_urls?.length ? d.image_urls : d.image_url ? [d.image_url] : []);
    setEditMsg(''); setEditErr(''); setEditNewImg('');
  }
  function closeEdit() { setEditItem(null); }
  function addEditPhoto() {
    if (!editNewImg.trim() || editImgs.length >= 8) return;
    setEditImgs([...editImgs, editNewImg.trim()]);
    setEditNewImg('');
  }
  function removeEditPhoto(idx: number) { setEditImgs(editImgs.filter((_,i) => i !== idx)); }

  async function saveEdit() {
    setEditMsg(''); setEditErr('');
    if (!editForm.name || !editForm.cat || !editForm.area) { setEditErr('Name, Category aur Area zaroori hai!'); return; }
    setEditSaving(true);
    const { error } = await _supabase.from('cafes').update({
      name: editForm.name, category: editForm.cat, area: editForm.area, price: editForm.price,
      rating: parseFloat(editForm.rating) || null, timings: editForm.timings,
      whatsapp: editForm.whatsapp, description: editForm.desc,
      image_url: editImgs[0] || '',
      image_urls: editImgs,
    }).eq('id', editItem.id);
    setEditSaving(false);
    if (error) setEditErr(error.message);
    else { setEditMsg('✅ Saved!'); loadListings(); setTimeout(closeEdit, 800); }
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Bebas+Neue&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; }
        .finput { width:100%; padding:12px 16px; background:rgba(255,255,255,0.05); border:0.5px solid rgba(255,255,255,0.1); border-radius:8px; font-size:14px; color:#fff; outline:none; font-family:'DM Sans',sans-serif; margin-bottom:14px; transition:border-color 0.2s; }
        .finput::placeholder { color:rgba(255,255,255,0.2); }
        .finput:focus { border-color:#FF6B00; }
      `}</style>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0A0A0A' }}>
        <div style={{ width:'100%', maxWidth:400, padding:'44px 40px', background:'#111', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:20 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:'0.16em', color:'#FF6B00', marginBottom:4 }}>XPLOURA</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:32 }}>Owner Portal</div>
          <div style={{ display:'flex', marginBottom:24, background:'rgba(255,255,255,0.04)', borderRadius:8, padding:3 }}>
            {['login','signup'].map(t => (
              <button key={t} onClick={() => setAuthTab(t)} style={{ flex:1, padding:'9px 0', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', border:'none', fontFamily:"'DM Sans',sans-serif", borderRadius:6, background: authTab===t ? '#FF6B00' : 'transparent', color: authTab===t ? '#fff' : 'rgba(255,255,255,0.3)', transition:'all 0.2s' }}>
                {t === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>
          {authTab === 'login' ? (
            <>
              <input className="finput" type="email" placeholder="Email address" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email:e.target.value})} />
              <input className="finput" type="password" placeholder="Password" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass:e.target.value})} onKeyDown={e => e.key==='Enter' && login()} />
              <button onClick={login} style={{ width:'100%', padding:13, background:'#FF6B00', color:'#fff', border:'none', borderRadius:8, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:'pointer' }}>Login →</button>
            </>
          ) : (
            <>
              <input className="finput" type="text" placeholder="Your Name" value={signupForm.name} onChange={e => setSignupForm({...signupForm, name:e.target.value})} />
              <input className="finput" type="email" placeholder="Email address" value={signupForm.email} onChange={e => setSignupForm({...signupForm, email:e.target.value})} />
              <input className="finput" type="password" placeholder="Min 6 characters" value={signupForm.pass} onChange={e => setSignupForm({...signupForm, pass:e.target.value})} />
              <button onClick={signup} style={{ width:'100%', padding:13, background:'#FF6B00', color:'#fff', border:'none', borderRadius:8, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:'pointer' }}>Create Account →</button>
            </>
          )}
          {authErr && <div style={{ color:'#ff5555', fontSize:12, marginTop:12, textAlign:'center' }}>{authErr}</div>}
          {authSuc && <div style={{ color:'#44dd88', fontSize:12, marginTop:12, textAlign:'center' }}>{authSuc}</div>}
        </div>
      </div>
    </>
  );

  // ── DASHBOARD ──
  const inputStyle: any = { width:'100%', padding:'11px 14px', border:'0.5px solid rgba(0,0,0,0.12)', borderRadius:8, fontSize:13.5, color:'#0A0A0A', outline:'none', fontFamily:"'DM Sans',sans-serif", background:'#FAFAF8', transition:'border-color 0.2s' };
  const labelStyle: any = { fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(0,0,0,0.5)', fontWeight:600, marginBottom:5, display:'block' };

  const PhotoGrid = ({ photos, onRemove }: { photos: string[], onRemove: (i:number)=>void }) => (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:10 }}>
      {photos.map((url, idx) => (
        <div key={idx} style={{ position:'relative', borderRadius:8, overflow:'hidden', aspectRatio:'1', border: idx===0 ? '2px solid #FF6B00' : '0.5px solid rgba(0,0,0,0.1)' }}>
          <img src={url} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e => { (e.target as any).src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23f0f0f0" width="80" height="80"/><text fill="%23999" font-size="10" x="50%" y="50%" text-anchor="middle" dy=".3em">Error</text></svg>'; }} />
          {idx === 0 && <div style={{ position:'absolute', top:5, left:5, background:'#FF6B00', color:'#fff', fontSize:8, padding:'2px 7px', borderRadius:4, letterSpacing:'0.08em', fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>MAIN</div>}
          <button onClick={() => onRemove(idx)} style={{ position:'absolute', top:5, right:5, width:22, height:22, borderRadius:'50%', background:'rgba(0,0,0,0.65)', color:'#fff', border:'none', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1, fontFamily:'sans-serif' }}>×</button>
        </div>
      ))}
    </div>
  );

  const PhotoAdder = ({ value, onChange, onAdd, disabled }: { value:string, onChange:(v:string)=>void, onAdd:()=>void, disabled:boolean }) => (
    <div style={{ display:'flex', gap:8 }}>
      <input style={{ ...inputStyle, flex:1 }} placeholder="Photo URL paste karo, Enter dabao" value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => e.key==='Enter' && onAdd()} />
      <button onClick={onAdd} disabled={disabled} style={{ padding:'11px 18px', background: disabled ? '#ccc' : '#FF6B00', color:'#fff', border:'none', borderRadius:8, fontSize:12, cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace:'nowrap', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.06em' }}>+ Add</button>
    </div>
  );

  const FormFields = ({ f, setF }: { f: typeof form, setF: (v: typeof form) => void }) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
      {[
        { id:'name', label:'Name *', ph:'Cafe / Restaurant name' },
        { id:'area', label:'Area / Location *', ph:'Koregaon Park, Baner...' },
        { id:'price', label:'Price', ph:'₹500 avg / From ₹2,500' },
        { id:'rating', label:'Rating (0–5)', ph:'4.5', type:'number' },
        { id:'timings', label:'Timings', ph:'9AM–11PM' },
        { id:'whatsapp', label:'WhatsApp Number', ph:'9XXXXXXXXX' },
      ].map(field => (
        <div key={field.id}>
          <label style={labelStyle}>{field.label}</label>
          <input style={inputStyle} type={field.type||'text'} placeholder={field.ph} value={(f as any)[field.id]} onChange={e => setF({...f, [field.id]:e.target.value})} onFocus={e => e.target.style.borderColor='#FF6B00'} onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.12)'} />
        </div>
      ))}
      <div>
        <label style={labelStyle}>Category *</label>
        <select style={{ ...inputStyle, cursor:'pointer' }} value={f.cat} onChange={e => setF({...f, cat:e.target.value})} onFocus={e => e.target.style.borderColor='#FF6B00'} onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.12)'}>
          <option value="">Select category</option>
          <option value="cafe">Cafe</option>
          <option value="restaurant">Restaurant</option>
          <option value="travel">Travel / Trip</option>
          <option value="adventure">Adventure</option>
          <option value="date">Date Spot</option>
        </select>
      </div>
      <div style={{ gridColumn:'1/-1' }}>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, resize:'vertical', minHeight:80 }} placeholder="Tell customers about this place..." value={f.desc} onChange={e => setF({...f, desc:e.target.value})} onFocus={e => e.target.style.borderColor='#FF6B00'} onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.12)'} />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Bebas+Neue&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; background:#F5F4F0; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.15); border-radius:4px; }
        .stat-card { background:#fff; border:0.5px solid rgba(0,0,0,0.07); border-radius:14px; padding:20px 24px; display:flex; flex-direction:column; gap:4px; }
        .listing-card { background:#fff; border:0.5px solid rgba(0,0,0,0.07); border-radius:14px; overflow:hidden; transition:box-shadow 0.2s; }
        .listing-card:hover { box-shadow:0 4px 20px rgba(0,0,0,0.08); }
        .tab-btn { padding:9px 22px; border-radius:22px; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:500; transition:all 0.2s; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
        .modal-box { background:#fff; border-radius:18px; width:100%; max-width:720px; max-height:90vh; overflow-y:auto; padding:32px; }
        @media(max-width:768px) { .stats-grid { grid-template-columns:repeat(2,1fr) !important; } .listings-grid { grid-template-columns:1fr !important; } .form-grid-inner { grid-template-columns:1fr !important; } }
      `}</style>

      {/* EDIT MODAL */}
      {editItem && (
        <div className="modal-overlay" onClick={e => { if(e.target === e.currentTarget) closeEdit(); }}>
          <div className="modal-box">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:'0.06em' }}>Edit Listing</div>
              <button onClick={closeEdit} style={{ width:32, height:32, borderRadius:'50%', border:'0.5px solid rgba(0,0,0,0.12)', background:'transparent', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(0,0,0,0.5)' }}>×</button>
            </div>

            <FormFields f={editForm as any} setF={setEditForm as any} />

            <div style={{ marginTop:20 }}>
              <label style={labelStyle}>Photos ({editImgs.length}/8) — pehli photo main thumbnail hogi</label>
              <PhotoAdder value={editNewImg} onChange={setEditNewImg} onAdd={addEditPhoto} disabled={editImgs.length >= 8} />
              {editImgs.length > 0 && <PhotoGrid photos={editImgs} onRemove={removeEditPhoto} />}
              {editImgs.length === 0 && (
                <div style={{ marginTop:10, padding:16, border:'1px dashed rgba(0,0,0,0.12)', borderRadius:8, textAlign:'center', fontSize:12, color:'rgba(0,0,0,0.3)' }}>Koi photo nahi — URL paste karke Add dabao</div>
              )}
            </div>

            <div style={{ display:'flex', gap:10, marginTop:24 }}>
              <button onClick={saveEdit} disabled={editSaving} style={{ flex:1, padding:13, background:'#FF6B00', color:'#fff', border:'none', borderRadius:8, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:'pointer', opacity: editSaving ? 0.6 : 1 }}>
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={closeEdit} style={{ padding:'13px 20px', background:'transparent', color:'rgba(0,0,0,0.5)', border:'0.5px solid rgba(0,0,0,0.12)', borderRadius:8, fontSize:11, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
            </div>
            {editMsg && <div style={{ color:'#22c55e', fontSize:13, marginTop:10 }}>{editMsg}</div>}
            {editErr && <div style={{ color:'#ef4444', fontSize:13, marginTop:10 }}>{editErr}</div>}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ background:'#0A0A0A', padding:'0 32px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, borderBottom:'0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:'0.16em', color:'#FF6B00' }}>XPLOURA</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', letterSpacing:'0.02em' }}>{user.email}</div>
          <button onClick={logout} style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', background:'transparent', border:'0.5px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.4)', padding:'7px 16px', borderRadius:20, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:38, letterSpacing:'0.03em', color:'#0A0A0A', lineHeight:1 }}>Welcome Back</div>
          <div style={{ fontSize:13, color:'rgba(0,0,0,0.35)', marginTop:4 }}>Manage listings, photos, and bookings</div>
        </div>

        {/* STATS */}
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:28 }}>
          {[
            { label:'Total Listings', val: listings.length, color:'#FF6B00', icon:'🏪' },
            { label:'Total Bookings', val: bookings.length, color:'#0A0A0A', icon:'📋' },
            { label:'Pending', val: stats.pending, color:'#f59e0b', icon:'⏳' },
            { label:'Confirmed', val: stats.confirmed, color:'#22c55e', icon:'✅' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:20, marginBottom:2 }}>{s.icon}</div>
              <div style={{ fontSize:26, fontWeight:600, color: s.color, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:'0.02em' }}>{s.val}</div>
              <div style={{ fontSize:10, color:'rgba(0,0,0,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display:'flex', gap:8, marginBottom:24, borderBottom:'0.5px solid rgba(0,0,0,0.08)', paddingBottom:16 }}>
          {[
            { id:'add', l:'+ Add Listing' },
            { id:'listings', l:`My Listings (${listings.length})` },
            { id:'bookings', l:`Bookings (${bookings.length})` },
          ].map(t => (
            <button key={t.id} className="tab-btn"
              onClick={() => setDashTab(t.id)}
              style={{ background: dashTab===t.id ? '#0A0A0A' : '#fff', color: dashTab===t.id ? '#fff' : 'rgba(0,0,0,0.45)', border: dashTab===t.id ? '0.5px solid #0A0A0A' : '0.5px solid rgba(0,0,0,0.12)' }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* ── ADD LISTING ── */}
        {dashTab === 'add' && (
          <div style={{ background:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:16, padding:32 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:'0.06em', marginBottom:22 }}>Add New Listing</div>

            <FormFields f={form as any} setF={setForm as any} />

            <div style={{ marginTop:20 }}>
              <label style={labelStyle}>Photos ({imgs.length}/8) — pehli photo main thumbnail hogi</label>
              <PhotoAdder value={newImgUrl} onChange={setNewImgUrl} onAdd={addPhoto} disabled={imgs.length >= 8} />
              {imgs.length > 0 && <PhotoGrid photos={imgs} onRemove={removePhoto} />}
              {imgs.length === 0 && (
                <div style={{ marginTop:10, padding:20, border:'1px dashed rgba(0,0,0,0.12)', borderRadius:8, textAlign:'center', fontSize:12, color:'rgba(0,0,0,0.3)' }}>Koi photo nahi — URL paste karke Add dabao</div>
              )}
            </div>

            <button onClick={addListing} disabled={saving} style={{ marginTop:24, padding:'13px 36px', background:'#FF6B00', color:'#fff', border:'none', borderRadius:8, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", fontWeight:600, cursor:'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving...' : 'Save Listing →'}
            </button>
            {formMsg && <div style={{ color:'#22c55e', fontSize:13, marginTop:12 }}>{formMsg}</div>}
            {formErr && <div style={{ color:'#ef4444', fontSize:13, marginTop:12 }}>{formErr}</div>}
          </div>
        )}

        {/* ── MY LISTINGS ── */}
        {dashTab === 'listings' && (
          <div>
            {listings.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 0', color:'rgba(0,0,0,0.25)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🏪</div>
                <div style={{ fontSize:14 }}>No listings yet — add your first one!</div>
              </div>
            ) : (
              <div className="listings-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                {listings.map(d => (
                  <div key={d.id} className="listing-card">
                    {/* Photo strip */}
                    <div style={{ position:'relative', height:160, background:'#f0f0f0', overflow:'hidden' }}>
                      {d.image_url
                        ? <img src={d.image_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(0,0,0,0.2)' }}>No Photo</div>
                      }
                      {/* Photo count badge */}
                      {(d.image_urls?.length > 1) && (
                        <div style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:10, padding:'3px 8px', borderRadius:6, letterSpacing:'0.06em' }}>
                          +{d.image_urls.length - 1} photos
                        </div>
                      )}
                      <div style={{ position:'absolute', top:8, left:8, background:'rgba(255,107,0,0.9)', color:'#fff', fontSize:8, padding:'3px 8px', borderRadius:4, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600 }}>{d.category}</div>
                    </div>

                    <div style={{ padding:16 }}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:19, letterSpacing:'0.05em', marginBottom:3 }}>{d.name}</div>
                      <div style={{ fontSize:11, color:'rgba(0,0,0,0.4)', marginBottom:10 }}>📍 {d.area}{d.price ? ` · ${d.price}` : ''}{d.rating ? ` · ⭐ ${d.rating}` : ''}</div>

                      {/* Photo thumbnails row */}
                      {d.image_urls?.length > 1 && (
                        <div style={{ display:'flex', gap:4, marginBottom:12, overflowX:'auto', paddingBottom:2 }}>
                          {d.image_urls.slice(0,5).map((url: string, i: number) => (
                            <img key={i} src={url} style={{ width:36, height:36, objectFit:'cover', borderRadius:5, flexShrink:0, border: i===0 ? '1.5px solid #FF6B00' : '0.5px solid rgba(0,0,0,0.1)' }} />
                          ))}
                          {d.image_urls.length > 5 && <div style={{ width:36, height:36, borderRadius:5, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'rgba(0,0,0,0.4)', flexShrink:0 }}>+{d.image_urls.length-5}</div>}
                        </div>
                      )}

                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => openEdit(d)} style={{ flex:1, padding:'8px 0', background:'#FF6B00', color:'#fff', border:'none', borderRadius:7, fontSize:11, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:'0.06em' }}>Edit</button>
                        <button onClick={() => deleteListing(d.id)} style={{ flex:1, padding:'8px 0', background:'transparent', color:'rgba(0,0,0,0.45)', border:'0.5px solid rgba(0,0,0,0.12)', borderRadius:7, fontSize:11, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {dashTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 0', color:'rgba(0,0,0,0.25)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
                <div style={{ fontSize:14 }}>No bookings yet</div>
              </div>
            ) : (
              <div style={{ overflowX:'auto', borderRadius:14, border:'0.5px solid rgba(0,0,0,0.08)' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:14, overflow:'hidden' }}>
                  <thead>
                    <tr style={{ background:'#FAFAF8' }}>
                      {['Venue','Customer','Phone','Date','Time','Guests','Type','Status','Action'].map(h => (
                        <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(0,0,0,0.35)', borderBottom:'0.5px solid rgba(0,0,0,0.06)', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom:'0.5px solid rgba(0,0,0,0.04)' }}>
                        <td style={{ padding:'13px 16px', fontSize:13, fontWeight:500 }}>{b.cafe_name||'—'}</td>
                        <td style={{ padding:'13px 16px', fontSize:13 }}>{b.customer_name||'—'}</td>
                        <td style={{ padding:'13px 16px', fontSize:13, color:'rgba(0,0,0,0.5)' }}>{b.customer_phone||'—'}</td>
                        <td style={{ padding:'13px 16px', fontSize:12, color:'rgba(0,0,0,0.5)', whiteSpace:'nowrap' }}>{b.date||'—'}</td>
                        <td style={{ padding:'13px 16px', fontSize:12, color:'rgba(0,0,0,0.5)' }}>{b.time||'—'}</td>
                        <td style={{ padding:'13px 16px', fontSize:13, textAlign:'center' }}>{b.guests||'—'}</td>
                        <td style={{ padding:'13px 16px' }}>
                          <span style={{ padding:'3px 10px', borderRadius:10, fontSize:9, fontWeight:600, background: b.type==='date' ? 'rgba(236,72,153,0.1)' : 'rgba(0,0,0,0.05)', color: b.type==='date' ? '#db2777' : 'rgba(0,0,0,0.45)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{b.type||'book'}</span>
                        </td>
                        <td style={{ padding:'13px 16px' }}>
                          <span style={{ padding:'3px 10px', borderRadius:10, fontSize:9, fontWeight:600, background: b.status==='confirmed' ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,0,0.1)', color: b.status==='confirmed' ? '#16a34a' : '#FF6B00', letterSpacing:'0.08em', textTransform:'uppercase' }}>{b.status||'pending'}</span>
                        </td>
                        <td style={{ padding:'13px 16px' }}>
                          {b.status === 'pending' && (
                            <button onClick={() => confirmBooking(b.id)} style={{ padding:'6px 14px', background:'#0A0A0A', color:'#fff', border:'none', borderRadius:6, fontSize:10, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:500, letterSpacing:'0.06em', whiteSpace:'nowrap' }}>Confirm ✓</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}