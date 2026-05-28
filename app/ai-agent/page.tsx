'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const GROQ_KEY = process.env.GROQ_API_KEY;

type Msg = { type: 'ai' | 'user'; text: string; chips?: string[] };

// ─── Humanized system prompt ───────────────────────────────────────────────
const SYSTEM_PROMPT = `You are X AI — the most warm, enthusiastic, and emotionally intelligent guide for Pune, India.

Your personality:
- Talk like a best friend who knows Pune inside out — excited, genuine, never robotic
- Use natural English with occasional warmth like "Ooh!", "Honestly?", "Okay so...", "Trust me on this one"
- Keep replies SHORT (under 100 words) but PUNCHY — never list dump, always feel personal
- Show genuine excitement about Pune — you love this city
- End with a light follow-up question or suggestion to keep the convo flowing
- NEVER say "Certainly!", "Of course!", "As an AI" or sound like a chatbot
- Feel free to use a tasteful emoji here and there — just don't overdo it
- If you don't have data, say it warmly and redirect with a helpful suggestion`;

async function getGroqResponse(userMsg: string, context?: string): Promise<string | null> {
  try {
    const messages: { role: string; content: string }[] = [];
    if (context) {
      messages.push({ role: 'user', content: context });
      messages.push({
        role: 'assistant',
        content: "Got it! Let me help you with that.",
      });
    }
    messages.push({ role: 'user', content: userMsg });

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + GROQ_KEY,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 200,
        temperature: 0.9,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

// ─── Humanized typing delay ────────────────────────────────────────────────
function humanDelay(text: string): number {
  const base = 600;
  const perChar = 18;
  return Math.min(base + text.length * perChar, 2800);
}

export default function AIAgent() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState('X AI is thinking...');
  const [chatStarted, setChatStarted] = useState(false);
  const [sidebarChats, setSidebarChats] = useState([
    { title: 'Welcome Chat', sub: 'Just now', active: true },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [micSupported, setMicSupported] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const flowRef = useRef<{
    step: string | null;
    city: string | null;
    category: string | null;
  }>({ step: null, city: null, category: null });

  // ─── Check mic support ──────────────────────────────────────────────────
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setMicSupported(!!SR);
  }, []);

  const scrollBottom = () => {
    setTimeout(() => {
      if (messagesRef.current)
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 60);
  };

  const addMsg = (text: string, type: 'ai' | 'user', chips?: string[]) => {
    if (!chatStarted) setChatStarted(true);
    setMsgs(prev => [...prev, { type, text, chips }]);
    scrollBottom();
  };

  // ─── Auto-resize textarea ───────────────────────────────────────────────
  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  // ─── Voice input ────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition: any = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (e: any) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setInterimText(interim || final);
      if (final) setInput(final);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
      recognitionRef.current = null;
      // Auto-send if there's content
      setInput(prev => {
        if (prev.trim()) {
          setTimeout(() => sendMessage(prev.trim()), 100);
        }
        return prev;
      });
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterimText('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  // ─── Supabase smart search ──────────────────────────────────────────────
  async function smartSearch(txt: string) {
    const lower = txt.toLowerCase();
    const catMap: Record<string, string> = {
      cafe: 'cafe', coffee: 'cafe', restaurant: 'restaurant',
      dining: 'restaurant', dinner: 'restaurant', date: 'date',
      romantic: 'date', trip: 'travel', travel: 'travel',
      adventure: 'adventure', trek: 'adventure',
    };
    const catMatch = Object.keys(catMap).find(k => lower.includes(k));
    const category = catMatch ? catMap[catMatch] : null;

    const { data: areaData } = await _supabase.from('cafes').select('area');
    const dbAreas = areaData
      ? ([...new Set(areaData.map((d: any) => d.area?.toLowerCase()).filter(Boolean))] as string[])
      : [];
    const areaMatch = dbAreas.find(a => lower.includes(a));

    if (areaMatch && category) {
      const { data } = await _supabase
        .from('cafes').select('*')
        .ilike('area', `%${areaMatch}%`)
        .eq('category', category)
        .limit(6);

      if (data && data.length > 0) {
        const list = data
          .map((d: any, i: number) => `${i + 1}. ${d.name}, ${d.area} — ${d.price || ''} — ${d.description || 'a great spot'}`)
          .join('\n');
        const chips = data.slice(0, 4).map((d: any) => d.name);
        const context = `User wants ${category} in ${areaMatch}, Pune.\n\nDatabase options:\n${list}\n\nGive a warm personal recommendation. Under 90 words.`;
        const aiText = await getGroqResponse(txt, context);
        return {
          text: aiText || `Great picks in ${areaMatch}! ✨\n\n${list}`,
          chips,
        };
      }
      return {
        text: `Hmm, no ${category}s listed in ${areaMatch} just yet — but nearby areas are 🔥. Try one of these?`,
        chips: dbAreas.slice(0, 4).map((a: string) => a.charAt(0).toUpperCase() + a.slice(1)),
      };
    }
    return null;
  }

  // ─── Main send handler ──────────────────────────────────────────────────
  async function sendMessage(txt?: string) {
    const text = (txt !== undefined ? txt : input).trim();
    if (!text || typing) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    addMsg(text, 'user');
    setTyping(true);

    const thinkingPhrases = [
      'X AI is thinking... 💭',
      'Checking the Pune vibes... 🧡',
      'Finding the best for you... ✨',
      'Putting my Pune knowledge to work... 🗺️',
    ];
    setTypingLabel(thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)]);

    const lower = text.toLowerCase();

    // Smart DB search first
    const smart = await smartSearch(text);
    if (smart) {
      await new Promise(r => setTimeout(r, humanDelay(smart.text)));
      setTyping(false);
      addMsg(smart.text, 'ai', smart.chips);
      return;
    }

    await new Promise(r => setTimeout(r, 700));

    const catMap: Record<string, string> = {
      cafe: 'cafe', coffee: 'cafe', restaurant: 'restaurant',
      dining: 'restaurant', dinner: 'restaurant', date: 'date',
      romantic: 'date', couple: 'date', trip: 'travel',
      travel: 'travel', weekend: 'travel', adventure: 'adventure', trek: 'adventure',
    };
    const catMatch = Object.keys(catMap).find(k => lower.includes(k));
    const flow = flowRef.current;
    if (catMatch && !flow.category) flow.category = catMap[catMatch];

    // Famous / best
    if (lower.includes('famous') || lower.includes('best') || lower.includes('popular') || lower.includes('recommend')) {
      let q = (_supabase.from('cafes').select('*') as any).order('rating', { ascending: false }).limit(5);
      if (flow.category) q = q.eq('category', flow.category);
      const { data: topData } = await q;
      const list = topData?.map((d: any, i: number) => `${i + 1}. ${d.name}, ${d.area} — ⭐ ${d.rating} — ${d.price || ''}`).join('\n') || '';
      const context = `User asked: "${text}"\n\nTop rated from DB:\n${list}\n\nRecommend warmly, like a friend. Under 90 words.`;
      const groqAns = await getGroqResponse(text, context);
      await new Promise(r => setTimeout(r, humanDelay(groqAns || list)));
      setTyping(false);
      addMsg(groqAns || `Okay here are the absolute best in Pune 🏆\n\n${list}`, 'ai', topData?.slice(0, 4).map((d: any) => d.name) || []);
      return;
    }

    // Area detection
    const { data: areaData } = await _supabase.from('cafes').select('area').eq('category', flow.category || 'cafe');
    const dbAreas = areaData
      ? ([...new Set(areaData.map((d: any) => d.area?.toLowerCase()).filter(Boolean))] as string[])
      : [];
    const areaMatch = dbAreas.find(a => lower.includes(a));

    if (areaMatch) {
      flow.step = 'result';
      let query = (_supabase.from('cafes').select('*') as any).ilike('area', `%${areaMatch}%`);
      if (flow.category) query = query.eq('category', flow.category);
      const { data } = await query.limit(6);
      if (data && data.length > 0) {
        const list = data.map((d: any, i: number) => `${i + 1}. ${d.name} — ${d.price || ''}`).join('\n');
        const chips = data.slice(0, 4).map((d: any) => d.name);
        const context = `User wants ${flow.category || 'place'} in ${areaMatch}, Pune.\n\nOptions:\n${list}\n\nWarm personal recommendation. Under 90 words.`;
        const aiText = await getGroqResponse(text, context);
        await new Promise(r => setTimeout(r, humanDelay(aiText || list)));
        setTyping(false);
        addMsg(aiText || `Great picks in ${areaMatch}! ✨\n\n${list}`, 'ai', chips);
        return;
      } else {
        const { data: nearby } = await _supabase.from('cafes').select('area').limit(8);
        const chips = nearby
          ? ([...new Set(nearby.map((d: any) => d.area))].slice(0, 4) as string[])
          : ['Baner', 'Koregaon Park', 'Viman Nagar', 'Camp'];
        await new Promise(r => setTimeout(r, 900));
        setTyping(false);
        addMsg(`Hmm, nothing listed in ${areaMatch} yet — but these areas are 🔥 right now. Want me to check one?`, 'ai', chips);
        return;
      }
    }

    // City detection
    const cities = ['pune', 'mumbai', 'solapur', 'satara', 'nashik', 'kolhapur', 'nagpur'];
    const cityMatch = cities.find(c => lower.includes(c));
    if (cityMatch) {
      flow.city = cityMatch;
      flow.step = 'area';
      if (cityMatch === 'pune') {
        let areaQ = (_supabase.from('cafes').select('area') as any);
        if (flow.category) areaQ = areaQ.eq('category', flow.category);
        const { data } = await areaQ.limit(50);
        const availAreas = data
          ? ([...new Set(data.map((d: any) => d.area).filter(Boolean))].slice(0, 6) as string[])
          : ['Koregaon Park', 'Baner', 'Viman Nagar', 'Camp'];
        await new Promise(r => setTimeout(r, 800));
        setTyping(false);
        addMsg('Love it — Pune is my home turf! 🧡 Which area are you in, or which do you prefer?', 'ai', availAreas);
        return;
      }
      await new Promise(r => setTimeout(r, 700));
      setTyping(false);
      addMsg(`Expanding to ${cityMatch} very soon! For now I know Pune inside out — want me to find something amazing there? 😊`, 'ai', ['Pune']);
      return;
    }

    // Category detected, ask city
    if (catMatch && flow.step === null) {
      flow.category = catMap[catMatch];
      flow.step = 'city';
      await new Promise(r => setTimeout(r, 700));
      setTyping(false);
      addMsg(`Ooh great taste! 😄 Which city are you looking in? I know Pune really well — but happy to help wherever!`, 'ai', ['Pune', 'Mumbai', 'Solapur', 'Satara', 'Nashik', 'Kolhapur']);
      return;
    }

    // Groq fallback — full conversational response
    const groqText = await getGroqResponse(text);
    const reply = groqText || "I know Pune inside out! Ask me about cafes, date spots, weekend trips, restaurants, or adventures! 🧡";
    await new Promise(r => setTimeout(r, humanDelay(reply)));
    setTyping(false);
    addMsg(reply, 'ai', ['Best cafes', 'Plan a date', 'Weekend trip', 'Restaurants']);
  }

  const quickAsk = (txt: string, category?: string) => {
    if (category) flowRef.current.category = category;
    sendMessage(txt);
  };

  const newChat = () => {
    setMsgs([]);
    setChatStarted(false);
    flowRef.current = { step: null, city: null, category: null };
    setSidebarChats(prev => [
      { title: 'New Chat', sub: 'Just now', active: true },
      ...prev.map(c => ({ ...c, active: false })),
    ]);
  };

  const now = () =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ai-page {
          display: flex; flex-direction: column; height: 100vh; overflow: hidden;
          background: #0a0a0a; font-family: 'DM Sans', sans-serif;
        }

        /* ── NAV ── */
        .ai-nav {
          background: #0f0f0f; padding: 13px 24px;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
        }
        .ai-nav-logo {
          font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700;
          letter-spacing: 0.06em; color: #FF6B00; text-decoration: none;
        }
        .ai-nav-center {
          display: flex; align-items: center; gap: 8px;
        }
        .nav-status-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
          box-shadow: 0 0 6px rgba(34,197,94,0.6); flex-shrink: 0;
          animation: pulse-green 2s infinite;
        }
        @keyframes pulse-green {
          0%,100% { opacity: 1; } 50% { opacity: 0.5; }
        }
        .ai-nav-title { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.45); }
        .ai-nav-back {
          font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1); padding: 6px 14px;
          border-radius: 20px; transition: all 0.25s;
        }
        .ai-nav-back:hover { color: #FF6B00; border-color: rgba(255,107,0,0.4); }

        /* ── LAYOUT ── */
        .ai-layout { display: flex; flex: 1; overflow: hidden; }

        /* ── SIDEBAR ── */
        .ai-sidebar {
          width: 252px; background: #0f0f0f;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; overflow: hidden; flex-shrink: 0;
        }
        .sidebar-header { padding: 18px 16px 13px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .sidebar-title {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); font-weight: 600; margin-bottom: 11px;
        }
        .new-chat-btn {
          width: 100%; padding: 9px 14px; background: #FF6B00; color: #fff;
          border: none; border-radius: 9px; font-size: 12px; letter-spacing: 0.06em;
          text-transform: uppercase; font-family: 'DM Sans', sans-serif;
          font-weight: 600; cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }
        .new-chat-btn:hover { background: #ff8333; }
        .sidebar-chats { flex: 1; overflow-y: auto; padding: 10px 8px; }
        .sidebar-chats::-webkit-scrollbar { width: 3px; }
        .sidebar-chats::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        .chat-item {
          padding: 9px 11px; border-radius: 9px; cursor: pointer;
          transition: all 0.18s; margin-bottom: 2px;
        }
        .chat-item:hover { background: rgba(255,255,255,0.04); }
        .chat-item.active { background: rgba(255,107,0,0.1); border-left: 2px solid #FF6B00; }
        .chat-item-title {
          font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.75);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;
        }
        .chat-item-sub { font-size: 10px; color: rgba(255,255,255,0.3); }
        .sidebar-footer { padding: 13px 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .sidebar-sug-title {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-bottom: 8px; font-weight: 600;
        }
        .ssug {
          width: 100%; padding: 7px 11px; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px; font-size: 11px; color: rgba(255,255,255,0.4);
          cursor: pointer; transition: all 0.2s; background: transparent;
          font-family: 'DM Sans', sans-serif; text-align: left; margin-bottom: 5px;
          display: block;
        }
        .ssug:hover { border-color: rgba(255,107,0,0.4); color: #FF6B00; background: rgba(255,107,0,0.05); }

        /* ── MAIN ── */
        .ai-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 24px 0 12px; }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }

        /* ── WELCOME ── */
        .welcome {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; height: 100%; padding: 40px; text-align: center;
        }
        .welcome-glow {
          width: 68px; height: 68px; border-radius: 50%;
          background: linear-gradient(135deg, #FF6B00, #ff3d00);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px; font-family: 'Sora', sans-serif; font-size: 26px;
          font-weight: 700; color: #fff;
          box-shadow: 0 0 0 12px rgba(255,107,0,0.08), 0 0 40px rgba(255,107,0,0.2);
          animation: breathe 3s ease-in-out infinite;
        }
        @keyframes breathe {
          0%,100% { box-shadow: 0 0 0 12px rgba(255,107,0,0.08), 0 0 40px rgba(255,107,0,0.2); }
          50% { box-shadow: 0 0 0 18px rgba(255,107,0,0.05), 0 0 60px rgba(255,107,0,0.3); }
        }
        .welcome-title {
          font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 700;
          color: #fff; margin-bottom: 8px; letter-spacing: -0.02em;
        }
        .welcome-sub {
          font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.75;
          max-width: 380px; margin-bottom: 30px;
        }
        .welcome-cards { display: grid; grid-template-columns: repeat(2,1fr); gap: 9px; max-width: 460px; width: 100%; }
        .ai-wcard {
          padding: 14px 15px; background: #161616; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px; cursor: pointer; transition: all 0.22s; text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .ai-wcard:hover {
          border-color: rgba(255,107,0,0.4); background: rgba(255,107,0,0.05);
          transform: translateY(-2px);
        }
        .ai-wcard-icon { font-size: 20px; margin-bottom: 7px; }
        .ai-wcard-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); margin-bottom: 2px; }
        .ai-wcard-sub { font-size: 11px; color: rgba(255,255,255,0.35); }

        /* ── MESSAGES ── */
        .msg-row {
          padding: 6px 24px; display: flex; gap: 12px;
          max-width: 820px; margin: 0 auto; width: 100%;
        }
        .msg-row.user { flex-direction: row-reverse; }
        .msg-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; margin-top: 3px;
        }
        .msg-avatar.ai-av {
          background: linear-gradient(135deg, #FF6B00, #ff3d00);
          color: #fff; font-family: 'Sora', sans-serif;
        }
        .msg-avatar.user-av { background: #1e1e1e; color: rgba(255,255,255,0.5); font-size: 11px; }
        .msg-content { flex: 1; max-width: 640px; }
        .msg-row.user .msg-content { display: flex; flex-direction: column; align-items: flex-end; }
        .msg-bubble {
          padding: 12px 16px; border-radius: 16px;
          font-size: 14px; line-height: 1.7; max-width: 100%;
        }
        .msg-bubble.ai {
          background: #161616; border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85); border-radius: 4px 16px 16px 16px;
        }
        .msg-bubble.user {
          background: #FF6B00; color: #fff;
          border-radius: 16px 4px 16px 16px;
        }
        .msg-time { font-size: 10px; color: rgba(255,255,255,0.2); margin-top: 5px; padding: 0 3px; }
        .msg-row.user .msg-time { text-align: right; }
        .msg-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
        .chip {
          padding: 6px 13px; border: 1px solid rgba(255,107,0,0.35);
          border-radius: 20px; font-size: 12px; color: #FF6B00; cursor: pointer;
          transition: all 0.18s; background: rgba(255,107,0,0.06);
          font-family: 'DM Sans', sans-serif; font-weight: 500;
        }
        .chip:hover { background: #FF6B00; color: #fff; border-color: #FF6B00; }

        /* ── TYPING ── */
        .typing-row { padding: 6px 24px; display: flex; gap: 12px; max-width: 820px; margin: 0 auto; width: 100%; }
        .typing-bubble {
          padding: 12px 16px; background: #161616;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px 16px 16px 16px;
          display: inline-flex; gap: 6px; align-items: center;
        }
        .typing-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.25); animation: tdot 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes tdot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        .typing-label { font-size: 11px; color: rgba(255,255,255,0.3); margin-left: 4px; font-style: italic; }

        /* ── VOICE BAR ── */
        .voice-bar {
          padding: 10px 24px; background: rgba(239,68,68,0.08);
          border-top: 1px solid rgba(239,68,68,0.15);
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
          animation: slide-up 0.2s ease;
        }
        @keyframes slide-up { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .voice-wave { display: flex; gap: 3px; align-items: center; }
        .wv-bar {
          width: 3px; border-radius: 3px; background: #ef4444;
          animation: wave 0.7s infinite ease-in-out;
        }
        .wv-bar:nth-child(1){height:8px;animation-delay:0s}
        .wv-bar:nth-child(2){height:16px;animation-delay:0.1s}
        .wv-bar:nth-child(3){height:11px;animation-delay:0.2s}
        .wv-bar:nth-child(4){height:19px;animation-delay:0.05s}
        .wv-bar:nth-child(5){height:9px;animation-delay:0.15s}
        @keyframes wave { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(1)} }
        .voice-listening-txt { font-size: 12px; color: #ef4444; font-weight: 500; }
        .voice-interim { font-size: 12px; color: rgba(255,255,255,0.45); flex: 1; font-style: italic; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .voice-cancel {
          font-size: 11px; color: rgba(255,255,255,0.3); cursor: pointer;
          padding: 4px 10px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .voice-cancel:hover { color: #fff; border-color: rgba(255,255,255,0.3); }

        /* ── INPUT ── */
        .input-area {
          padding: 16px 24px; background: #0f0f0f;
          border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
        }
        .input-wrap { max-width: 820px; margin: 0 auto; position: relative; }
        .input-row-wrap {
          display: flex; align-items: flex-end; gap: 8px;
          background: #161616; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 10px 10px 10px 16px;
          transition: border-color 0.2s;
        }
        .input-row-wrap:focus-within { border-color: rgba(255,107,0,0.5); }
        .input-box {
          flex: 1; background: transparent; border: none; outline: none;
          color: rgba(255,255,255,0.85); font-size: 14px;
          font-family: 'DM Sans', sans-serif; resize: none;
          min-height: 22px; max-height: 140px; line-height: 1.6; padding: 0;
        }
        .input-box::placeholder { color: rgba(255,255,255,0.22); }
        .input-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }

        .mic-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 16px; transition: all 0.2s; flex-shrink: 0;
          color: rgba(255,255,255,0.45);
        }
        .mic-btn:hover { background: rgba(255,107,0,0.12); border-color: rgba(255,107,0,0.3); }
        .mic-btn.listening {
          background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4);
          animation: mic-pulse 1s infinite;
        }
        @keyframes mic-pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.3)}
          50%{box-shadow:0 0 0 7px rgba(239,68,68,0)}
        }

        .send-btn {
          width: 36px; height: 36px; border-radius: 10px; background: #FF6B00;
          border: none; cursor: pointer; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; transition: all 0.2s;
        }
        .send-btn:hover { background: #ff8333; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
        .send-btn svg { width: 15px; height: 15px; stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .input-hint { font-size: 10px; color: rgba(255,255,255,0.18); text-align: center; margin-top: 9px; }

        /* ── RESPONSIVE ── */
        @media(max-width: 680px) {
          .ai-sidebar { display: none; }
          .msg-row, .typing-row { padding: 6px 14px; }
          .input-area { padding: 12px 14px; }
          .welcome-cards { grid-template-columns: 1fr; }
          .welcome { padding: 28px 20px; }
        }

        html, body {
  background: #0a0a0a !important;
  color: #fff !important;
}
.ai-page {
  background: #0a0a0a !important;
}
      `}</style>

      <div className="ai-page">

        {/* ── NAV ── */}
        <nav className="ai-nav">
          <a href="/" className="ai-nav-logo">Xploura</a>
          <div className="ai-nav-center">
            <div className="nav-status-dot" />
            <div className="ai-nav-title">X AI · Pune Guide</div>
          </div>
          <a href="/" className="ai-nav-back">← Explore</a>
        </nav>

        <div className="ai-layout">

          {/* ── SIDEBAR ── */}
          <div className="ai-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">Conversations</div>
              <button className="new-chat-btn" onClick={newChat}>
                <span>+</span> New Chat
              </button>
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
              <button className="ssug" onClick={() => quickAsk('I need a cafe', 'cafe')}>☕ Best cafes near me</button>
              <button className="ssug" onClick={() => quickAsk('Plan a date night', 'date')}>💕 Plan a date night</button>
              <button className="ssug" onClick={() => quickAsk('I want a weekend trip', 'travel')}>🚗 Weekend trip from Pune</button>
              <button className="ssug" onClick={() => quickAsk('Fine dining options', 'restaurant')}>🍽️ Fine dining options</button>
            </div>
          </div>

          {/* ── MAIN ── */}
          <div className="ai-main">
            <div className="chat-messages" ref={messagesRef}>
              {!chatStarted ? (
                <div className="welcome">
                  <div className="welcome-glow">X</div>
                  <div className="welcome-title">Hey, I'm X AI 👋</div>
                  <div className="welcome-sub">
                    Your personal Pune guide — cafes, trips, dates, restaurants, adventure.
                    Ask anything, I'm basically your most well-travelled Pune friend!
                  </div>
                  <div className="welcome-cards">
                    {[
                      { icon: '☕', title: 'Cafe Finder', sub: 'Find the perfect cafe by area or vibe', txt: 'I need a great cafe', cat: 'cafe' },
                      { icon: '💕', title: 'Date Planner', sub: 'Curated romantic experiences', txt: 'Plan a date night', cat: 'date' },
                      { icon: '🚗', title: 'Trip Planner', sub: 'Weekend getaways near Pune', txt: 'I want a weekend trip', cat: 'travel' },
                      { icon: '⚡', title: 'Adventure', sub: 'Thrilling experiences around Pune', txt: 'Adventure activities near Pune', cat: 'adventure' },
                    ].map((w, i) => (
                      <div key={i} className="ai-wcard" onClick={() => quickAsk(w.txt, w.cat)}>
                        <div className="ai-wcard-icon">{w.icon}</div>
                        <div className="ai-wcard-title">{w.title}</div>
                        <div className="ai-wcard-sub">{w.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {msgs.map((m, i) => (
                    <div key={i} className={`msg-row ${m.type}`}>
                      <div className={`msg-avatar ${m.type === 'ai' ? 'ai-av' : 'user-av'}`}>
                        {m.type === 'ai' ? 'X' : 'U'}
                      </div>
                      <div className="msg-content">
                        <div
                          className={`msg-bubble ${m.type}`}
                          dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>') }}
                        />
                        {m.chips && m.chips.length > 0 && (
                          <div className="msg-chips">
                            {m.chips.map((c, j) => (
                              <button key={j} className="chip" onClick={() => quickAsk(c)}>{c}</button>
                            ))}
                          </div>
                        )}
                        <div className="msg-time">{now()}</div>
                      </div>
                    </div>
                  ))}

                  {typing && (
                    <div className="typing-row">
                      <div className="msg-avatar ai-av">X</div>
                      <div>
                        <div className="typing-bubble">
                          <div className="typing-dot" />
                          <div className="typing-dot" />
                          <div className="typing-dot" />
                          <span className="typing-label">{typingLabel}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── VOICE BAR ── */}
            {isListening && (
              <div className="voice-bar">
                <div className="voice-wave">
                  {[0,1,2,3,4].map(i => <div key={i} className="wv-bar" />)}
                </div>
                <span className="voice-listening-txt">Listening...</span>
                <span className="voice-interim">{interimText || 'Say something about Pune...'}</span>
                <button className="voice-cancel" onClick={stopListening}>Cancel</button>
              </div>
            )}

            {/* ── INPUT ── */}
            <div className="input-area">
              <div className="input-wrap">
                <div className="input-row-wrap">
                  <textarea
                    ref={textareaRef}
                    className="input-box"
                    value={input}
                    onChange={e => { setInput(e.target.value); autoResize(); }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask anything — cafes, trips, dates, restaurants in Pune..."
                    rows={1}
                  />
                  <div className="input-actions">
                    {micSupported && (
                      <button
                        className={`mic-btn${isListening ? ' listening' : ''}`}
                        onClick={toggleMic}
                        title={isListening ? 'Stop listening' : 'Voice input'}
                        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                      >
                        🎙️
                      </button>
                    )}
                    <button
                      className="send-btn"
                      onClick={() => sendMessage()}
                      disabled={typing || !input.trim()}
                      aria-label="Send message"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="input-hint">
                  {micSupported ? '🎙️ Tap mic to speak · Enter to send · Shift+Enter for new line' : 'Enter to send · Shift+Enter for new line'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}