 'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthPage() {
  const [tab, setTab] = useState('signin');
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name:'', email:'', password:'', bizName:'', bizWa:'' });
  const [msg, setMsg] = useState({ text:'', type:'' });
  const [loading, setLoading] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'signup') setTab('signup');
    _supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && params.get('tab') !== 'signup') {
        const r = session.user?.user_metadata?.role || 'customer';
        window.location.href = r === 'owner' ? '/admin' : '/';
      }
    });
  }, []);

  async function handleSubmit() {
    setMsg({ text:'', type:'' });
    setLoading(true);

    if (tab === 'signup') {
      const { data, error } = await _supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.name, role, business_name: form.bizName || null, whatsapp: form.bizWa || null } }
      });
      if (error) setMsg({ text: error.message, type: 'error' });
      else if (data?.user?.identities?.length === 0) setMsg({ text: 'Email already registered. Please sign in.', type: 'error' });
      else {
        if (role === 'owner' && data.user) {
          await _supabase.from('cafe_owners').insert({ user_id: data.user.id, email: form.email, name: form.name, business: form.bizName, whatsapp: form.bizWa });
        }
        setMsg({ text: '✅ Check your email to confirm your account!', type: 'success' });
      }
    } else {
      const { data, error } = await _supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) setMsg({ text: error.message, type: 'error' });
      else {
        setMsg({ text: '✅ Welcome back! Redirecting...', type: 'success' });
        const r = data.user?.user_metadata?.role || 'customer';
        setTimeout(() => { window.location.href = r === 'owner' ? '/admin' : '/'; }, 1200);
      }
    }
    setLoading(false);
  }

  const titles: any = {
    signin: { customer: 'Welcome Back', owner: 'Owner Sign In' },
    signup: { customer: 'Start Exploring', owner: 'List Your Business' },
  };

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; background:#000; color:#fff; min-height:100vh; }
        .finput { width:100%; padding:13px 16px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; margin-bottom:14px; transition:border-color 0.25s; }
        .finput:focus { border-color:rgba(255,107,0,0.5); }
        .finput::placeholder { color:rgba(255,255,255,0.2); }
      `}</style>

      <div style={{ display:'flex', minHeight:'100vh' }}>

        {/* LEFT PANEL */}
        <div style={{ flex:'0 0 48%', background:'#0a0a0a', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'36px 44px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,107,0,0.08) 0%,transparent 50%,rgba(0,0,0,0.8) 100%)' }} />
          
          {/* Logo */}
          <a href="/" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:'0.16em', color:'#fff', textDecoration:'none', position:'relative', zIndex:2 }}>Xploura</a>

          {/* Content */}
          <div style={{ position:'relative', zIndex:2 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(48px,5.5vw,72px)', lineHeight:0.88, letterSpacing:'0.03em', marginBottom:18 }}>
              <span style={{ color:'#fff', display:'block' }}>Your</span>
              <span style={{ color:'transparent', WebkitTextStroke:'1.5px rgba(255,255,255,0.22)', display:'block' }}>Next</span>
              <span style={{ color:'#FF6B00', display:'block' }}>World</span>
              <span style={{ color:'#fff', display:'block' }}>Awaits</span>
            </div>
            <p style={{ fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', lineHeight:1.9 }}>Cafes · Dates · Adventure<br/>Restaurants · Trips</p>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:28, position:'relative', zIndex:2 }}>
            {[{n:'240+',l:'Destinations'},{n:'4.9',l:'Avg Rating'},{n:'92K',l:'Explorers'}].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:'0.06em', color:'#FF6B00', lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 52px', background:'#000', borderLeft:'1px solid rgba(255,107,0,0.15)' }}>
          <div style={{ width:'100%', maxWidth:400 }}>

           
            {/* TABS */}
            <div style={{ display:'flex', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, overflow:'hidden', marginBottom:26 }}>
              {[{id:'signin',l:'Sign In'},{id:'signup',l:'Get Started'}].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:11, background: tab===t.id ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)', color: tab===t.id ? '#FF6B00' : 'rgba(255,255,255,0.5)', fontFamily:"'DM Sans',sans-serif", fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight: tab===t.id ? 600 : 400, cursor:'pointer', border:'none' }}>
                  {t.l}
                </button>
              ))}
            </div>

            {/* TITLE */}
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:38, letterSpacing:'0.06em', marginBottom:6 }}>{titles[tab][role]}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.32)', letterSpacing:'0.05em', marginBottom:28, lineHeight:1.7 }}>
              {tab === 'signin' ? (role === 'owner' ? 'Access your listing dashboard' : 'Sign in to continue your journey') : (role === 'owner' ? "Join as a partner — it's free" : 'Create your free Xploura account')}
            </div>

            {/* MSG */}
            {msg.text && (
              <div style={{ padding:'12px 16px', borderRadius:8, fontSize:13, marginBottom:14, background: msg.type==='error' ? 'rgba(255,60,60,0.1)' : 'rgba(74,222,128,0.08)', border: msg.type==='error' ? '1px solid rgba(255,60,60,0.25)' : '1px solid rgba(74,222,128,0.2)', color: msg.type==='error' ? '#ff6b6b' : '#4ade80' }}>
                {msg.text}
              </div>
            )}

            

            {/* NAME */}
            {tab === 'signup' && <input className="finput" type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />}

            {/* EMAIL & PASSWORD */}
            <input className="finput" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
            <div style={{ position:'relative' }}>
              <input className="finput" type={pwVisible ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({...form, password:e.target.value})} onKeyDown={e => e.key==='Enter' && handleSubmit()} style={{ paddingRight:44 }} />
              <button onClick={() => setPwVisible(!pwVisible)} style={{ position:'absolute', right:14, top:14, background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)' }}>
                {pwVisible ? '🙈' : '👁'}
              </button>
            </div>

            {/* SUBMIT */}
            <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', padding:15, background:'#FF6B00', border:'none', borderRadius:8, color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', marginTop:4, opacity: loading ? 0.5 : 1 }}>
              {loading ? 'Please wait...' : tab === 'signin' ? 'Sign In' : role === 'owner' ? 'Register Business' : 'Create Account'}
            </button>

            {/* FOOTER */}
            <div style={{ marginTop:22, textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.25)', lineHeight:1.7 }}>
              {tab === 'signup'
                ? <span>Already have an account? <a href="#" onClick={() => setTab('signin')} style={{ color:'#FF6B00', textDecoration:'none' }}>Sign In →</a></span>
                : <span>Don't have an account? <a href="#" onClick={() => setTab('signup')} style={{ color:'#FF6B00', textDecoration:'none' }}>Get Started free →</a></span>
              }
            </div>
            <div style={{ marginTop:10, textAlign:'center', fontSize:12 }}>
              <a href="/" style={{ color:'rgba(255,107,0,0.6)', textDecoration:'none' }}>← Back to Xploura</a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
