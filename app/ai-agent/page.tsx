'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const GROQ_KEY = process.env.GROQ_API_KEY;

type Msg = { type: 'ai' | 'user'; text: string; chips?: string[] };

async function getGroqResponse(systemPrompt: string, userMsg: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMsg }],
        max_tokens: 300, temperature: 0.85
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch { return null; }
}

export default function AIAgent() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [sidebarChats, setSidebarChats] = useState([{ title: 'Welcome Chat', sub: 'Just now', active: true }]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef({ step: null as string | null, city: null as string | null, category: null as string | null });

  const scrollBottom = () => {
    setTimeout(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, 50);
  };

  const addMsg = (text: string, type: 'ai' | 'user', chips?: string[]) => {
    if (!chatStarted) setChatStarted(true);
    setMsgs(prev => [...prev, { type, text, chips }]);
    scrollBottom();
  };

  async function smartSearch(txt: string) {
    const lower = txt.toLowerCase();
    const catMap: any = { cafe: 'cafe', coffee: 'cafe', restaurant: 'restaurant', dining: 'restaurant', date: 'date', romantic: 'date', trip: 'travel', travel: 'travel', adventure: 'adventure', trek: 'adventure' };
    const catMatch = Object.keys(catMap).find(k => lower.includes(k));
    const category = catMatch ? catMap[catMatch] : null;
    const { data: areaData } = await _supabase.from('cafes').select('area');
    const dbAreas = areaData ? [...new Set(areaData.map((d: any) => d.area?.toLowerCase()).filter(Boolean))] as string[] : [];
    const areaMatch = dbAreas.find(a => lower.includes(a));
    if (areaMatch && category) {
      const { data } = await _supabase.from('cafes').select('*').ilike('area', `%${areaMatch}%`).eq('category', category).limit(6);
      if (data && data.length > 0) {
        const list = data.map((d: any, i: number) => `${i + 1}. ${d.name}, ${d.area} — ${d.price || ''} — ${d.description || 'a great spot'}`).join('\n');
        const chips = data.slice(0, 4).map((d: any) => d.name);
        const aiText = await getGroqResponse(
          `You are X AI — a warm, enthusiastic, emotional guide for Pune. Speak from the heart like a best friend. Under 120 words. End by asking if they want to book.`,
          `User wants ${category} in ${areaMatch}, Pune. Options from database:\n${list}\nRecommend warmly.`
        );
        return { text: aiText || `Great options in ${areaMatch}:\n\n${list}`, chips };
      }
      return { text: `No ${category}s in ${areaMatch} yet. Try nearby areas:`, chips: dbAreas.slice(0, 4).map((a: string) => a.charAt(0).toUpperCase() + a.slice(1)) };
    }
    return null;
  }

  async function sendMessage(txt?: string) {
    const text = (txt || input).trim();
    if (!text || typing) return;
    setInput('');
    addMsg(text, 'user');
    setTyping(true);
    const lower = text.toLowerCase();

    const smart = await smartSearch(text);
    if (smart) { setTyping(false); addMsg(smart.text, 'ai', smart.chips); return; }

    await new Promise(r => setTimeout(r, 600));

    const catMap: any = { cafe: 'cafe', coffee: 'cafe', restaurant: 'restaurant', dining: 'restaurant', dinner: 'restaurant', date: 'date', romantic: 'date', couple: 'date', trip: 'travel', travel: 'travel', weekend: 'travel', adventure: 'adventure', trek: 'adventure' };
    const catMatch = Object.keys(catMap).find(k => lower.includes(k));
    const flow = flowRef.current;

    if (catMatch && !flow.category) flow.category = catMap[catMatch];

    // Famous/best
    if (lower.includes('famous') || lower.includes('best') || lower.includes('popular') || lower.includes('recommend')) {
      let q = _supabase.from('cafes').select('*').order('rating', { ascending: false }).limit(5);
      if (flow.category) q = (q as any).eq('category', flow.category);
      const { data: topData } = await (q as any);
      const list = topData?.map((d: any, i: number) => `${i + 1}. ${d.name}, ${d.area} — Rating: ${d.rating} — ${d.price || ''}`).join('\n') || '';
      const groqAns = await getGroqResponse(`You are X AI — warm, enthusiastic Pune guide. Recommend like excited best friend. Under 100 words.`, `User asked: "${text}". Top rated:\n${list}\nRecommend warmly.`);
      setTyping(false);
      addMsg(groqAns || `Pune's top spots!\n\n${list}`, 'ai', topData?.slice(0, 4).map((d: any) => d.name) || []);
      return;
    }

    // Area detect
    const { data: areaData } = await _supabase.from('cafes').select('area').eq('category', flow.category || 'cafe');
    const dbAreas = areaData ? [...new Set(areaData.map((d: any) => d.area?.toLowerCase()).filter(Boolean))] as string[] : [];
    const areaMatch = dbAreas.find(a => lower.includes(a));

    if (areaMatch) {
      flow.step = 'result';
      let query = (_supabase.from('cafes').select('*') as any).ilike('area', `%${areaMatch}%`);
      if (flow.category) query = query.eq('category', flow.category);
      const { data } = await query.limit(6);
      if (data && data.length > 0) {
        const list = data.map((d: any, i: number) => `${i + 1}. ${d.name} — ${d.price || ''}`).join('\n');
        const chips = data.slice(0, 4).map((d: any) => d.name);
        const aiText = await getGroqResponse(`You are X AI — warm guide for Pune. Speak like excited best friend. Under 100 words.`, `User wants ${flow.category || 'place'} in ${areaMatch}. Options:\n${list}\nRecommend warmly.`);
        setTyping(false); addMsg(aiText || `Great options in ${areaMatch}:\n\n${list}`, 'ai', chips); return;
      } else {
        const { data: nearby } = await _supabase.from('cafes').select('area').limit(8);
        const chips = nearby ? [...new Set(nearby.map((d: any) => d.area))].slice(0, 4) as string[] : ['Baner', 'Koregaon Park', 'Viman Nagar', 'Camp'];
        setTyping(false); addMsg(`No listings in ${areaMatch} yet. Try these areas:`, 'ai', chips); return;
      }
    }

    // City detect
    const cities = ['pune', 'mumbai', 'solapur', 'satara', 'nashik', 'kolhapur', 'nagpur'];
    const cityMatch = cities.find(c => lower.includes(c));
    if (cityMatch) {
      flow.city = cityMatch; flow.step = 'area';
      if (cityMatch === 'pune') {
        let areaQ = (_supabase.from('cafes').select('area') as any);
        if (flow.category) areaQ = areaQ.eq('category', flow.category);
        const { data } = await areaQ.limit(50);
        const availAreas = data ? [...new Set(data.map((d: any) => d.area).filter(Boolean))].slice(0, 6) as string[] : ['Koregaon Park', 'Baner', 'Viman Nagar', 'Camp'];
        setTyping(false); addMsg('Which area in Pune do you prefer?', 'ai', availAreas); return;
      }
      setTyping(false); addMsg(`Expanding to ${cityMatch} soon! Currently available in Pune.`, 'ai', ['Pune']); return;
    }

    // Category detected
    if (catMatch && flow.step === null) {
      flow.category = catMap[catMatch]; flow.step = 'city';
      setTyping(false); addMsg('Which city are you looking in?', 'ai', ['Pune', 'Mumbai', 'Solapur', 'Satara', 'Nashik', 'Kolhapur']); return;
    }

    // Groq fallback
    const groqText = await getGroqResponse(
      `You are X AI — super warm, enthusiastic, friendly guide for Pune. Love Pune and everything about it. Respond like excited best friend. For greetings — warmly welcome and ask what they're looking for. Under 80 words.`,
      text
    );
    setTyping(false);
    addMsg(groqText || "I know Pune inside out! Ask me about cafes, date spots, weekend trips, restaurants, or adventure activities!", 'ai', ['Best cafes', 'Plan a date', 'Weekend trip', 'Restaurants']);
  }

  const quickAsk = (txt: string, category?: string) => {
    if (category) flowRef.current.category = category;
    sendMessage(txt);
  };

  const newChat = () => {
    setMsgs([]); setChatStarted(false);
    flowRef.current = { step: null, city: null, category: null };
    setSidebarChats(prev => [{ title: 'New Chat', sub: 'Just now', active: true }, ...prev.map(c => ({ ...c, active: false }))]);
  };

  return (
    <>
      <style>{`
        .ai-page { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #FAFAF8; font-family: 'DM Sans', sans-serif; }
        .ai-nav { background: #000; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; border-bottom: 0.5px solid rgba(255,255,255,0.06); }
        .ai-nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.14em; color: #FF6B00; text-decoration: none; }
        .ai-nav-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; }
        .ai-nav-back { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.35); text-decoration: none; border: 0.5px solid rgba(255,255,255,0.12); padding: 7px 14px; border-radius: 18px; transition: all 0.3s; }
        .ai-nav-back:hover { color: #FF6B00; border-color: #FF6B00; }
        .ai-layout { display: flex; flex: 1; overflow: hidden; }
        .ai-sidebar { width: 260px; background: #fff; border-right: 1px solid rgba(0,0,0,0.08); display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0; }
        .sidebar-header { padding: 20px 18px 14px; border-bottom: 1px solid rgba(0,0,0,0.08); }
        .sidebar-title { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(0,0,0,0.45); font-weight: 600; margin-bottom: 12px; }
        .new-chat-btn { width: 100%; padding: 10px 14px; background: #FF6B00; color: #fff; border: none; border-radius: 8px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
        .new-chat-btn:hover { background: #FF8C35; }
        .sidebar-chats { flex: 1; overflow-y: auto; padding: 12px 10px; }
        .chat-item { padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; margin-bottom: 2px; }
        .chat-item:hover { background: #f5f5f3; }
        .chat-item.active { background: rgba(255,107,0,0.08); border-left: 2px solid #FF6B00; }
        .chat-item-title { font-size: 13px; font-weight: 500; color: #1a1a1a; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chat-item-sub { font-size: 11px; color: rgba(0,0,0,0.45); }
        .sidebar-footer { padding: 14px 18px; border-top: 1px solid rgba(0,0,0,0.08); }
        .sidebar-sug-title { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(0,0,0,0.45); margin-bottom: 8px; font-weight: 600; }
        .ssug { width: 100%; padding: 8px 12px; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; font-size: 12px; color: rgba(0,0,0,0.45); cursor: pointer; transition: all 0.2s; background: #fff; font-family: 'DM Sans', sans-serif; text-align: left; margin-bottom: 6px; }
        .ssug:hover { border-color: #FF6B00; color: #FF6B00; background: rgba(255,107,0,0.04); }
        .ai-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 28px 0; }
        .welcome { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 40px; text-align: center; }
        .welcome-icon { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg,#FF6B00,#CC5500); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #fff; box-shadow: 0 8px 24px rgba(255,107,0,0.3); }
        .welcome-title { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 0.04em; color: #1a1a1a; margin-bottom: 8px; }
        .welcome-sub { font-size: 14px; color: rgba(0,0,0,0.45); line-height: 1.7; max-width: 400px; margin-bottom: 32px; }
        .welcome-cards { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; max-width: 500px; width: 100%; }
        .wcard { padding: 14px 16px; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; cursor: pointer; transition: all 0.25s; text-align: left; }
        .wcard:hover { border-color: #FF6B00; box-shadow: 0 4px 16px rgba(255,107,0,0.1); transform: translateY(-2px); }
        .wcard-icon { font-size: 20px; margin-bottom: 6px; }
        .wcard-title { font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 2px; }
        .wcard-sub { font-size: 11px; color: rgba(0,0,0,0.45); }
        .msg-row { padding: 8px 28px; display: flex; gap: 14px; max-width: 860px; margin: 0 auto; width: 100%; }
        .msg-row.user { flex-direction: row-reverse; }
        .msg-avatar { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-top: 2px; }
        .msg-avatar.ai-av { background: linear-gradient(135deg,#FF6B00,#CC5500); color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 14px; }
        .msg-avatar.user-av { background: #1a1a1a; color: #fff; }
        .msg-content { flex: 1; max-width: 680px; }
        .msg-row.user .msg-content { display: flex; flex-direction: column; align-items: flex-end; }
        .msg-bubble { padding: 13px 17px; border-radius: 14px; font-size: 14px; line-height: 1.7; max-width: 100%; }
        .msg-bubble.ai { background: #fff; border: 1px solid rgba(0,0,0,0.08); color: #1a1a1a; border-radius: 4px 14px 14px 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .msg-bubble.user { background: #FF6B00; color: #fff; border-radius: 14px 4px 14px 14px; }
        .msg-time { font-size: 10px; color: rgba(0,0,0,0.35); margin-top: 5px; }
        .msg-row.user .msg-time { text-align: right; }
        .msg-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
        .chip { padding: 7px 14px; border: 1.5px solid rgba(255,107,0,0.3); border-radius: 20px; font-size: 12px; color: #FF6B00; cursor: pointer; transition: all 0.2s; background: rgba(255,107,0,0.04); font-family: 'DM Sans', sans-serif; font-weight: 500; }
        .chip:hover { background: #FF6B00; color: #fff; border-color: #FF6B00; }
        .typing-bubble { padding: 13px 17px; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 4px 14px 14px 14px; display: inline-flex; gap: 5px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(0,0,0,0.2); animation: tdot 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes tdot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        .input-area { padding: 20px 28px; background: #FAFAF8; border-top: 1px solid rgba(0,0,0,0.08); flex-shrink: 0; }
        .input-wrap { max-width: 860px; margin: 0 auto; position: relative; }
        .input-box { width: 100%; padding: 16px 56px 16px 20px; border: 1.5px solid rgba(0,0,0,0.08); border-radius: 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #1a1a1a; outline: none; background: #fff; resize: none; min-height: 54px; transition: border-color 0.2s; line-height: 1.5; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .input-box:focus { border-color: #FF6B00; box-shadow: 0 2px 12px rgba(255,107,0,0.1); }
        .input-box::placeholder { color: rgba(0,0,0,0.28); }
        .send-btn { position: absolute; right: 12px; bottom: 12px; width: 36px; height: 36px; border-radius: 10px; background: #FF6B00; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .send-btn:hover { background: #FF8C35; transform: scale(1.05); }
        .send-btn svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2.5; }
        .input-hint { font-size: 11px; color: rgba(0,0,0,0.35); text-align: center; margin-top: 8px; }
        @media(max-width: 700px) { .ai-sidebar { display: none; } .msg-row { padding: 8px 16px; } .input-area { padding: 14px 16px; } .welcome-cards { grid-template-columns: 1fr; } }
      `}</style>

      <div className="ai-page">
        {/* NAV */}
        <nav className="ai-nav">
          <a href="/" className="ai-nav-logo">Xploura</a>
          <div className="ai-nav-title">X AI · Pune Guide</div>
          <a href="/" className="ai-nav-back">← Explore</a>
        </nav>

        <div className="ai-layout">
          {/* SIDEBAR */}
          <div className="ai-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">Conversations</div>
              <button className="new-chat-btn" onClick={newChat}><span>+</span> New Chat</button>
            </div>
            <div className="sidebar-chats">
              {sidebarChats.map((c, i) => (
                <div key={i} className={`chat-item${c.active ? ' active' : ''}`}>
                  <div className="chat-item-title">{c.title}</div>
                  <div className="chat-item-sub">{c.sub}</div>
                </div>
              ))}
            </div>
            <div className="sidebar-footer">
              <div className="sidebar-sug-title">Quick asks</div>
              <button className="ssug" onClick={() => quickAsk('I need a cafe', 'cafe')}>~ Best cafes near me</button>
              <button className="ssug" onClick={() => quickAsk('Plan a date night', 'date')}>* Plan a date night</button>
              <button className="ssug" onClick={() => quickAsk('I want a weekend trip', 'travel')}>&gt; Weekend trip from Pune</button>
              <button className="ssug" onClick={() => quickAsk('Fine dining options', 'restaurant')}>◈ Fine dining options</button>
            </div>
          </div>

          {/* MAIN */}
          <div className="ai-main">
            <div className="chat-messages" ref={messagesRef}>
              {!chatStarted ? (
                <div className="welcome">
                  <div className="welcome-icon">X</div>
                  <div className="welcome-title">X AI</div>
                  <div className="welcome-sub">Your personal Pune guide — cafes, trips, dates, restaurants, adventure. Just ask anything!</div>
                  <div className="welcome-cards">
                    {[
                      { icon: '☕', title: 'Cafe Finder', sub: 'Find the perfect cafe by area or vibe', txt: 'I need a cafe', cat: 'cafe' },
                      { icon: '♥', title: 'Date Planner', sub: 'Curated romantic experiences', txt: 'Plan a date night', cat: 'date' },
                      { icon: '✈', title: 'Trip Planner', sub: 'Weekend getaways near Pune', txt: 'I want a weekend trip', cat: 'travel' },
                      { icon: '⚡', title: 'Adventure', sub: 'Thrilling experiences around Pune', txt: 'Adventure activities', cat: 'adventure' },
                    ].map((w, i) => (
                      <div key={i} className="wcard" onClick={() => quickAsk(w.txt, w.cat)}>
                        <div className="wcard-icon">{w.icon}</div>
                        <div className="wcard-title">{w.title}</div>
                        <div className="wcard-sub">{w.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {msgs.map((m, i) => (
                    <div key={i} className={`msg-row ${m.type}`}>
                      <div className={`msg-avatar ${m.type === 'ai' ? 'ai-av' : 'user-av'}`}>{m.type === 'ai' ? 'X' : 'U'}</div>
                      <div className="msg-content">
                        <div className={`msg-bubble ${m.type}`} dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>') }} />
                        {m.chips && m.chips.length > 0 && (
                          <div className="msg-chips">
                            {m.chips.map((c, j) => <button key={j} className="chip" onClick={() => quickAsk(c)}>{c}</button>)}
                          </div>
                        )}
                        <div className="msg-time">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="msg-row ai">
                      <div className="msg-avatar ai-av">X</div>
                      <div className="msg-content">
                        <div className="typing-bubble">
                          <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* INPUT */}
            <div className="input-area">
              <div className="input-wrap">
                <textarea
                  className="input-box"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask anything — cafes, trips, dates, restaurants in Pune..."
                  rows={1}
                />
                <button className="send-btn" onClick={() => sendMessage()}>
                  <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="input-hint">X AI knows Pune inside out — cafes, trips, dates & more</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}