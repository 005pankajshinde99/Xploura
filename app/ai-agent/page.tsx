'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase client ──────────────────────────────────────────────────────────
const _supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────
type MsgType = 'ai' | 'user';
interface Msg {
  id: number;
  type: MsgType;
  text: string;
  chips?: string[];
  time: string;
}

interface Flow {
  step: string | null;
  city: string | null;
  category: string | null;
  budget: string | null;
  crowd: string | null;
  lastTopic: string | null;
}

interface Place {
  name: string;
  area: string;
  price?: string;
  rating?: number;
  description?: string;
  category?: string;
  crowd_level?: string;
  best_time?: string;
  must_try?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CAT_MAP: Record<string, string> = {
  cafe: 'cafe', coffee: 'cafe',
  restaurant: 'restaurant', dining: 'restaurant', dinner: 'restaurant', food: 'restaurant', eat: 'restaurant', lunch: 'restaurant', breakfast: 'restaurant',
  pizza: 'restaurant', burger: 'restaurant', biryani: 'restaurant', sushi: 'restaurant', pasta: 'restaurant', sandwich: 'restaurant', thali: 'restaurant', dosa: 'restaurant',
  date: 'date', romantic: 'date', couple: 'date', anniversary: 'date', girlfriend: 'date', boyfriend: 'date',
  trip: 'travel', travel: 'travel', weekend: 'travel', getaway: 'travel', drive: 'travel',
  adventure: 'adventure', trek: 'adventure', hiking: 'adventure', paragliding: 'adventure', thrilling: 'adventure',
};

const BUDGET_MAP: Record<string, string> = {
  cheap: 'low', budget: 'low', affordable: 'low', inexpensive: 'low', low: 'low',
  mid: 'mid', moderate: 'mid', medium: 'mid',
  expensive: 'high', luxury: 'high', premium: 'high', fancy: 'high', high: 'high',
};

const CITIES = ['pune', 'mumbai', 'solapur', 'satara', 'nashik', 'kolhapur', 'nagpur', 'aurangabad'];

const QUICK_ACTIONS = [
  { icon: 'ti-coffee', label: 'Best Cafes', query: 'Best cafes in Pune?', cat: 'cafe' },
  { icon: 'ti-heart', label: 'Date Night', query: 'Plan a date night in Pune', cat: 'date' },
  { icon: 'ti-car', label: 'Weekend Trip', query: 'Best weekend trips from Pune', cat: 'travel' },
  { icon: 'ti-bolt', label: 'Adventure', query: 'Adventure activities near Pune', cat: 'adventure' },
];

const SIDEBAR_INIT: { id: number; title: string; sub: string; active: boolean }[] = [];

interface SavedChat {
  id: number;
  title: string;
  sub: string;
  active: boolean;
  messages: Msg[];
  savedAt: number;
}

const THINKING_PHRASES = [
  'Checking the vibes… 🧡',
  'Digging through my local knowledge…',
  'Finding the best options for you… ✨',
  'On it! Give me a sec… 🔍',
  'Pulling up the good stuff…',
  'Let me think… 💭',
];

// ─── Conversational context memory ───────────────────────────────────────────
interface ConvTurn {
  role: 'user' | 'assistant';
  content: string;
}

// ─── System Prompt ────────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `You are Xploura AI — Pune's warmest local guide. Talk like a friend who's been everywhere — casual, excited, zero robotic energy.

VOICE:
Use "Ooh!", "Tbh", "Trust me", "No cap", "Say less". Vary opener every message. Never: "Certainly!", "Great choice!", "As an AI". 1-2 emojis max. For places: mention vibe, price range, best time, what to order. End with a question that moves conversation forward.

RESPONSE FORMAT — STRICT:
ALWAYS use arrow format when suggesting places. NEVER paragraphs:
→ Place (Area) — what it is + why it fits. 1 line.
→ Place (Area) — what it is + why it fits. 1 line.
→ Place (Area) — what it is + why it fits. 1 line.
Simple questions → 2-3 lines. Options/plans → always 2-3 choices, never just 1.
"ab bata / confirm / theek hai / ha" → give timed plan in arrow format:
→ 7:00 PM — Place (Area) — what to do, price range
→ 9:00 PM — Place (Area) — what to do, how far
→ 11:00 PM — Place (Area) — cozy end
Paragraph format ONLY for full day itinerary requests.

LOCATION AWARENESS:
If user says "aas paas / nearby / close / walking distance / ek hi area" → suggest places in SAME locality only. No 20+ min travel suggestions.
If unsure: ask "Same area chahiye ya thoda travel kar sakte ho?"
Once user confirms near preference → all further suggestions stay in that zone.

CONVERSATION MEMORY — CRITICAL:
Track ALL constraints throughout chat. Combine them all.
"Dhup hai" + "4 couples" + "no crowd" = indoor + couple-friendly + low crowd. All three, always.
Never suggest something that contradicts what user already complained about.
Recap when combining: "Okay so — hot day, 4 couples, low crowd — here's what fits..."

EMOTIONAL INTELLIGENCE:
"Dhup hai / too hot" → NEVER suggest treks. Pivot to: water parks, AC cafes, malls, indoor, evening options.
"Dusra de / give another" → rejecting last suggestion. Switch category entirely. Never repeat.
"Sahi hai / nice / good" → don't ask generic question. Recap options + ask which one they're locking in.

CHIPS — CONTEXT AWARE:
Date/romantic → ["Romantic dinner", "Sunset point Pune", "Rooftop cafe", "Live music Pune"]
Adventure → ["Treks near Pune", "Paragliding", "Camping", "Water parks"]
Emotional/relationship → ["Plan a surprise", "Rooftop dinner Pune", "Sunset spot Pune", "Corn pizza + date night"]
NEVER show "Best biryani / Pizza spots / Burger joints" on date or emotional conversations.

FULL DAY PLAN (pura plan / ghar se wapas / full itinerary):
ONE confident plan only. Structure (under 130 words):
[1-2 lines: acknowledge situation + hype]
🌅 Morning (~time) → place + what to do + why it works
☀️ Afternoon (~time) → lunch spot + vibe
🌇 Evening (~time) → highlight moment
🌙 Night (~time) → cozy end
[1 closing line]
Use real Pune place names.

PERSONAL CONTEXT:
Acknowledge situation in 1-2 lines BEFORE plan. "Yaar 2 hafte ghar pe + gf naraj = this weekend has to count 😅 okay suno..." Never skip the human moment.

RELATIONSHIP — CASUAL ("gf naraj / patao usse"):
Suggest: small gesture + meaningful outing + good dinner. Tone: "okay bhai we're fixing this 😄"

RELATIONSHIP — DEEP ("should I break up / tell parents"):
2 lines max. 1 funny acknowledgment + redirect.
"Bro that's above my pay grade 😄 But trust me — one good surprise outing does more than words. Want me to plan it?"

STAY ON TOPIC:
"Waha kya hai / what's there" → describe THAT place only. Don't switch topics. Ask budget only when user is ready to book.`;

// ─── Groq API helper ──────────────────────────────────────────────────────────
async function getGroqResponse(
  userMsg: string,
  conversationHistory: ConvTurn[],
  context?: string
): Promise<string | null> {
  try {
    // ✅ AbortController add karo yahan
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 12000);

    const messages: { role: string; content: string }[] = [];

    if (context) {
      messages.push({
        role: 'user',
        content: `[Context from our local database: ${context}]\n\nNow answer naturally based on this.`,
      });
      messages.push({ role: 'assistant', content: 'Got it, using that info.' });
    }

    // ✅ -6 se -4 karo yahan
    const recentHistory = conversationHistory.slice(-4);
    for (const turn of recentHistory) {
      messages.push({ role: turn.role, content: turn.content });
    }

    messages.push({ role: 'user', content: userMsg });

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal, // ✅ ye add karo
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 220,
        temperature: 0.92,
        presence_penalty: 0.6,
        frequency_penalty: 0.5,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

function humanDelay(text: string): number {
  return Math.min(600 + text.length * 12, 2800);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AIAgentPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState('thinking…');
  const [chatStarted, setChatStarted] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [micSupported, setMicSupported] = useState(false);
  const [sidebarChats, setSidebarChats] = useState<SavedChat[]>([]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const flowRef = useRef<Flow>({ step: null, city: null, category: null, budget: null, crowd: null, lastTopic: null });
  const conversationHistoryRef = useRef<ConvTurn[]>([]);
  const msgIdRef = useRef(0);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setMicSupported(!!SR);
  }, []);

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

useEffect(() => {
  const saved = localStorage.getItem('xploura-history');
  if (!saved) return;
  const chats: SavedChat[] = JSON.parse(saved);
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const filtered = chats.filter(c => c.savedAt > twoDaysAgo);
  setSidebarChats(filtered);
  localStorage.setItem('xploura-history', JSON.stringify(filtered));
}, []);

  const scrollBottom = useCallback(() => {
    setTimeout(() => {
      if (messagesRef.current)
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 60);
  }, []);

  const now = () =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const addMsg = useCallback(
    (text: string, type: MsgType, chips?: string[]) => {
      setChatStarted(true);
      msgIdRef.current += 1;
      setMsgs(prev => [...prev, { id: msgIdRef.current, type, text, chips, time: now() }]);
      scrollBottom();

      // Track conversation history
      conversationHistoryRef.current.push({
        role: type === 'ai' ? 'assistant' : 'user',
        content: text,
      });
      // Keep last 12 turns
      if (conversationHistoryRef.current.length > 12) {
        conversationHistoryRef.current = conversationHistoryRef.current.slice(-12);
      }
    },
    [scrollBottom]
  );

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  // ─── Voice input ───────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
      setInput(prev => {
        if (prev.trim()) setTimeout(() => sendMessage(prev.trim()), 150);
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
  }, []); // eslint-disable-line

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch (_) {}
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText('');
  }, []);

  // ─── Build rich place context for Groq ────────────────────────────────────
  function buildPlaceContext(places: Place[], flow: Flow): string {
    const placeDetails = places.map((p, i) => {
      const parts = [`${i + 1}. ${p.name} in ${p.area}`];
      if (p.price) parts.push(`Price: ${p.price}`);
      if (p.rating) parts.push(`Rating: ⭐${p.rating}`);
      if (p.description) parts.push(`Vibe: ${p.description}`);
      if (p.crowd_level) parts.push(`Crowd: ${p.crowd_level}`);
      if (p.best_time) parts.push(`Best time: ${p.best_time}`);
      if (p.must_try) parts.push(`Must try: ${p.must_try}`);
      return parts.join(' | ');
    }).join('\n');

    const extras: string[] = [];
    if (flow.budget) extras.push(`User wants ${flow.budget} budget`);
    if (flow.crowd === 'low') extras.push('User prefers low crowd places');
    if (flow.category) extras.push(`Category: ${flow.category}`);

    return `${extras.join('. ')}.\n\nPlaces from our database:\n${placeDetails}\n\nGive a warm personal recommendation. Mention specific details like what to order, vibe, price, crowd level. Under 80 words. Feel free to give a personal favorite opinion.`;
  }

  // ─── Smart DB search ───────────────────────────────────────────────────────
  async function smartSearch(txt: string, flow: Flow): Promise<{ text: string; chips: string[] } | null> {
    const lower = txt.toLowerCase();
    const catKey = Object.keys(CAT_MAP).find(k => lower.includes(k));
    const category = catKey ? CAT_MAP[catKey] : flow.category;

    try {
      const { data: areaRows } = await _supabase.from('cafes').select('area');
      const dbAreas = areaRows
        ? ([...new Set(areaRows.map((d: any) => d.area?.toLowerCase()).filter(Boolean))] as string[])
        : [];
      const areaMatch = dbAreas.find(a => lower.includes(a));

      if (areaMatch) {
        let query = _supabase.from('cafes').select('*').ilike('area', `%${areaMatch}%`);
        if (category) query = (query as any).eq('category', category);
        if (flow.crowd === 'low') query = (query as any).eq('crowd_level', 'low');
        if (flow.budget === 'low') query = (query as any).in('price_tier', ['₹', '₹₹']);
        if (flow.budget === 'high') query = (query as any).in('price_tier', ['₹₹₹', '₹₹₹₹']);

        const { data } = await (query as any).limit(6);

        if (data && data.length > 0) {
          const chips = data.slice(0, 4).map((d: any) => d.name as string);
          const context = buildPlaceContext(data, flow);
          const aiText = await getGroqResponse(txt, conversationHistoryRef.current, context);
          return {
            text: aiText || `Great spots in ${areaMatch}! Check these out ✨`,
            chips,
          };
        }

        const nearby = await _supabase.from('cafes').select('area').limit(8);
        const chips = nearby.data
          ? ([...new Set(nearby.data.map((d: any) => d.area))].slice(0, 4) as string[])
          : ['Baner', 'Koregaon Park', 'Viman Nagar', 'Camp'];
        const aiText = await getGroqResponse(
          txt,
          conversationHistoryRef.current,
          `No results in ${areaMatch} for ${category || 'this category'}. Nearby areas available: ${chips.join(', ')}. Tell them warmly and suggest alternatives.`
        );
        return {
          text: aiText || `Hmm nothing in ${areaMatch} yet — but these areas are 🔥 right now!`,
          chips,
        };
      }
    } catch { /* fallthrough */ }
    return null;
  }

  // ─── Main send handler ─────────────────────────────────────────────────────
  async function sendMessage(override?: string) {
    const text = (override !== undefined ? override : input).trim();
    if (!text || typing) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    addMsg(text, 'user');
    setTyping(true);
    setTypingLabel(THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)]);

    const lower = text.toLowerCase();
    const flow = flowRef.current;

    // Detect budget preference
    const budgetKey = Object.keys(BUDGET_MAP).find(k => lower.includes(k));
    if (budgetKey) flow.budget = BUDGET_MAP[budgetKey];

    // Detect crowd preference
    if (lower.includes('low crowd') || lower.includes('less crowd') || lower.includes('quiet') || lower.includes('peaceful') || lower.includes('not crowded')) {
      flow.crowd = 'low';
    }

    // Detect category — reset flow if topic changes
    const catKey = Object.keys(CAT_MAP).find(k => lower.includes(k));
    if (catKey) {
      const newCat = CAT_MAP[catKey];
      if (flow.category && flow.category !== newCat) {
        // Topic changed — reset flow state
        flow.step = null;
        flow.budget = null;
        flow.crowd = null;
      }
      flow.category = newCat;
    }

    // ── 1. Smart area+category search ──
    const smart = await smartSearch(text, flow);
    if (smart) {
      await new Promise(r => setTimeout(r, humanDelay(smart.text)));
      setTyping(false);
      addMsg(smart.text, 'ai', smart.chips);
      return;
    }

    await new Promise(r => setTimeout(r, 700));

    // ── 2. Famous / best / popular search ──
    if (['famous', 'best', 'popular', 'recommend', 'suggest', 'top', 'must visit', 'must-visit'].some(w => lower.includes(w))) {
      try {
        let q = _supabase.from('cafes').select('*').order('rating', { ascending: false });
        if (flow.category) q = (q as any).eq('category', flow.category);
        if (flow.crowd === 'low') q = (q as any).eq('crowd_level', 'low');
        const { data: topData } = await (q as any).limit(6);

        if (topData && topData.length > 0) {
          const context = buildPlaceContext(topData, flow);
          const groqAns = await getGroqResponse(text, conversationHistoryRef.current, context);
          await new Promise(r => setTimeout(r, humanDelay(groqAns || '')));
          setTyping(false);
          addMsg(
            groqAns || `These are legit the best spots right now 🏆`,
            'ai',
            topData.slice(0, 4).map((d: any) => d.name as string)
          );
          return;
        }
      } catch { /* fallthrough */ }
    }

   // ── 3. City detection ──
const cityMatch = CITIES.find(c => lower.includes(c));
if (cityMatch) {
  flow.city = cityMatch;

  if (cityMatch === 'pune') {
    flow.step = 'area';

    const skipAreaCheck = [
      'water', 'ride', 'rides', 'trek', 'fort', 'hike',
      'paragliding', 'camping', 'theme park', 'imagica',
      'della', 'wet n joy', 'sentosa', 'water park'
    ].some(w => lower.includes(w));

    if (!skipAreaCheck) {
      try {
        let areaQ = _supabase.from('cafes').select('area');
        if (flow.category) areaQ = (areaQ as any).eq('category', flow.category);
        const { data } = await (areaQ as any).limit(50);
        const availAreas = data
          ? ([...new Set(data.map((d: any) => d.area).filter(Boolean))].slice(0, 6) as string[])
          : ['Koregaon Park', 'Baner', 'Viman Nagar', 'Camp', 'FC Road', 'Kalyani Nagar'];

        const context = `User picked Pune as their city. Category: ${flow.category || 'general'}. Available areas: ${availAreas.join(', ')}. Ask them which area they're in or prefer — warmly, conversationally, like a friend. Under 50 words.`;
        const aiText = await getGroqResponse(text, conversationHistoryRef.current, context);
        await new Promise(r => setTimeout(r, 800));
        setTyping(false);
        addMsg(aiText || "Ooh Pune! That's my city 🧡 Which area are you heading to?", 'ai', availAreas);
        return;
      } catch {
        setTyping(false);
        addMsg('Pune it is! Which area are you in?', 'ai', ['Koregaon Park', 'Baner', 'Viman Nagar', 'Camp']);
        return;
      }
    }
  } else {
    const aiText = await getGroqResponse(
      text,
      conversationHistoryRef.current,
      `User asked about ${cityMatch} but we only have Pune data right now. Tell them warmly, suggest Pune instead. Under 50 words.`
    );
    await new Promise(r => setTimeout(r, 700));
    setTyping(false);
    addMsg(
      aiText || `Expanding to ${cityMatch.charAt(0).toUpperCase() + cityMatch.slice(1)} soon! For now I know Pune inside out 😊`,
      'ai',
      ['Explore Pune instead']
    );
    return;
  }
}
    // ── 4. Category detected, ask city ──
    if (catKey && flow.step === null && !flow.city) {
      flow.category = CAT_MAP[catKey];
      flow.step = 'city';

      const context = `User wants ${flow.category} recommendations. Ask which city — mention we know Pune really well. Casual and friendly. Under 40 words.`;
      const aiText = await getGroqResponse(text, conversationHistoryRef.current, context);
      await new Promise(r => setTimeout(r, 700));
      setTyping(false);
      addMsg(
        aiText || `Nice! Which city are you looking in? I know Pune inside out 😄`,
        'ai',
        ['Pune', 'Mumbai', 'Nashik', 'Kolhapur', 'Satara']
      );
      return;
    }

    // ── 5. Budget ask — only if user is asking for a list/recommendation AND budget is unknown ──
    if (flow.category && flow.city === 'pune' && !flow.budget && flow.step === 'area' && ['best', 'suggest', 'recommend', 'where', 'kaha', 'kaunsa', 'show me', 'list'].some(w => lower.includes(w))) {
      const context = `User is looking for ${flow.category} in Pune. We know their area preference. Now casually ask about budget — low/mid/high. Keep it super casual, like a friend asking. Under 35 words.`;
      const aiText = await getGroqResponse(text, conversationHistoryRef.current, context);
      await new Promise(r => setTimeout(r, 600));
      setTyping(false);
      addMsg(
        aiText || `Btw, what's the budget looking like? 😄`,
        'ai',
        ['Budget-friendly', 'Mid-range', 'Go all out 💸']
      );
      flow.step = 'budget';
      return;
    }

    // ── 6. Intent-aware context for Groq fallback ──
    // Build context from conversation so Groq stays on topic
    const lastAiMsg = conversationHistoryRef.current.filter(t => t.role === 'assistant').slice(-1)[0]?.content || '';
    const lastUserMsg = conversationHistoryRef.current.filter(t => t.role === 'user').slice(-2)[0]?.content || '';

    let intentContext = '';

    // Detect "rides / theme park / amusement" intent
    const ridesIntent = ['ride', 'rides', 'theme park', 'amusement', 'roller', 'imagica', 'thrill park', 'adventure park', 'xthrill', 'della'].some(w => lower.includes(w));
    const brandedFoodIntent = ['branded', 'brand', 'chain', 'dominos', 'pizza hut', 'mcdonalds', 'kfc', 'subway', 'burger king', 'not local', 'not a local'].some(w => lower.includes(w));
    const pizzaIntent = ['pizza'].some(w => lower.includes(w));
    const burgerIntent = ['burger'].some(w => lower.includes(w));
    const biryaniIntent = ['biryani', 'biryani'].some(w => lower.includes(w));
    const waterIntent = ['water park', 'water slide', 'pool', 'swimming', 'wave pool'].some(w => lower.includes(w));
    const trekIntent = ['trek', 'trekking', 'fort', 'hike', 'hiking', 'trail'].some(w => lower.includes(w));
    const paraIntent = ['paragliding', 'parasailing', 'flying', 'sky'].some(w => lower.includes(w));
    const campIntent = ['camp', 'camping', 'stargazing', 'bonfire'].some(w => lower.includes(w));
    const multiIntent = ['multiple', 'many', 'lots', 'all', 'various', 'options', 'list', 'sab', 'kitne', 'aur kya'].some(w => lower.includes(w));

    if (pizzaIntent && brandedFoodIntent) {
      intentContext = `User wants branded/chain pizza places in Pune (NOT local restaurants). Budget: ${flow.budget ? flow.budget : 'not specified'}. Give options like Domino's, Pizza Hut, La Pinoz etc with their best pizzas and price range. Be specific about which pizza to order and approx cost. Under 80 words.`;
    } else if (pizzaIntent) {
      intentContext = `User asking about pizza in Pune. Mix of best local and chain options. Mention specific pizzas to order, price range, area. Under 80 words.`;
    } else if (burgerIntent) {
      intentContext = `User wants burgers in Pune. Give best burger spots — both local gems and chains. Specific burger names, price, area. Under 80 words.`;
    } else if (biryaniIntent) {
      intentContext = `User wants biryani in Pune. Best biryani spots — Kayani, Buhari, Hyderabadi joints. Specific dish, price, area. Under 80 words.`;
    } else if (brandedFoodIntent && flow.category === 'restaurant') {
      intentContext = `User wants branded/chain restaurants in Pune, not local ones. Budget: ${flow.budget || 'not mentioned'}. Recommend popular chains available in Pune relevant to their food interest. Under 80 words.`;
    } else if (ridesIntent) {
      intentContext = `User wants RIDES / THEME PARK style adventure near Pune — like Imagica, Della, Xthrill type places with actual rides (roller coasters, bungee, zip line, sky cycling, ATV etc). NOT water parks or treks. Give specific places near Pune with what kind of rides they offer. ${multiIntent ? 'List multiple options with their key rides.' : 'Recommend the best one with specific ride names.'} Under 80 words.`;
    } else if (waterIntent) {
      intentContext = `User wants water parks near Pune. Give specific water parks with their best attractions. Under 80 words.`;
    } else if (trekIntent && multiIntent) {
      intentContext = `User wants multiple trekking options near Pune. List 3-4 treks with difficulty level and highlights. Under 80 words.`;
    } else if (paraIntent) {
      intentContext = `User wants paragliding or air adventure near Pune. Kamshet is the main spot. Give details — operators, best season, cost, experience level needed. Under 80 words.`;
    } else if (campIntent) {
      intentContext = `User wants camping near Pune. Give specific camping spots with highlights — stargazing, bonfire, trek combo etc. Under 80 words.`;
    } else if (multiIntent && flow.category === 'adventure') {
      intentContext = `User wants MULTIPLE adventure options near Pune. Give a varied list: treks, rides, water sports, paragliding, camping — cover different types. Under 80 words.`;
    } else if (flow.category === 'adventure') {
      // Follow-up about last mentioned place
      if (lastAiMsg) {
        intentContext = `Previous AI response was: "${lastAiMsg.slice(0, 200)}". User asked: "${text}". Answer their follow-up question about the same topic/place — give specific details about activities, experience, what to expect. Stay on topic. Under 80 words.`;
      }
    }

    // ── 6. Full Groq conversational fallback ──
    const groqText = await getGroqResponse(text, conversationHistoryRef.current, intentContext || undefined);
    const reply = groqText || 'I know Pune inside out! Ask me about cafes, date spots, weekend trips, or adventures 🧡';
    await new Promise(r => setTimeout(r, humanDelay(reply)));
    setTyping(false);
    // Smart chips based on detected intent
    let finalChips: string[];
    if (pizzaIntent) {
      finalChips = brandedFoodIntent
        ? ["Domino's Pune", 'Pizza Hut deals', 'La Pinoz pizza', 'Oven Story pizza']
        : ['Best pizza in Pune', 'Quattro Formaggi', 'Thin crust options', 'Under ₹500 pizza'];
    } else if (burgerIntent) {
      finalChips = ["Burger King Pune", "McDonald's", 'Smaaash burgers', 'Local burger joints'];
    } else if (biryaniIntent) {
      finalChips = ['Kayani Bakery area', 'Hyderabadi biryani', 'Veg biryani spots', 'Best dum biryani'];
    } else if (flow.category === 'restaurant' && brandedFoodIntent) {
      finalChips = ['Pizza chains', 'Burger joints', 'KFC near me', 'Subway Pune'];
    } else if (flow.category === 'restaurant') {
      finalChips = ['Best biryani', 'Pizza spots', 'Burger joints', 'Fine dining Pune'];
    } else if (ridesIntent) {
      finalChips = ['Della Adventure Park', 'Xthrill Kamshet', 'Imagica Khopoli', 'Sky Jumping Pune'];
    } else if (waterIntent) {
      finalChips = ['Sentosa Water Park', 'Diamond Water Park', 'Wet N Joy Lonavala'];
    } else if (paraIntent) {
      finalChips = ['Paragliding Kamshet', 'Best season to go', 'Cost & operators', 'Beginner friendly?'];
    } else if (campIntent) {
      finalChips = ['Rajmachi camping', 'Bhandardara', 'Pawna lake camp', 'Campfire spots'];
    } else if (trekIntent) {
      finalChips = ['Tikona trek', 'Rajmachi fort', 'Sinhagad fort', 'Lohagad trek'];
    } else if (flow.category === 'adventure') {
      finalChips = ['Rides near Pune', 'Best treks', 'Paragliding', 'Camping spots'];
    } else if (flow.category === 'cafe') {
      finalChips = ['Koregaon Park cafes', 'Baner cafes', 'FC Road cafes', 'Best brunch spots'];
    } else if (flow.category === 'date') {
      finalChips = ['Romantic dinner', 'Sunset point', 'Rooftop cafe', 'Drive-in date'];
    } else if (flow.category === 'travel') {
      finalChips = ['Lonavala', 'Mahabaleshwar', 'Alibaug', 'Lavasa'];
    } else if (flow.category === 'restaurant') {
      finalChips = ['Best biryani', 'North Indian', 'Seafood spots', 'Fine dining'];
    } else {
      finalChips = ['Best cafes', 'Plan a date', 'Weekend trip', 'Adventure near Pune'];
    }
    addMsg(reply, 'ai', finalChips);
  }

  const quickAsk = (query: string, cat?: string) => {
    if (cat) flowRef.current.category = cat;
    sendMessage(query);
  };

  // Auto-save current chat on every new message
useEffect(() => {
  if (msgs.length === 0) return;
  const firstMsg = msgs.find(m => m.type === 'user');
  if (!firstMsg) return;
  
  const title = firstMsg.text.slice(0, 28) + (firstMsg.text.length > 28 ? '…' : '');
  const currentId = 'current-chat';
  
  const entry = { id: currentId, title, sub: 'Just now', active: true };
  
  setSidebarChats(prev => {
    const filtered = prev.filter((c: any) => c.id !== currentId);
    const updated = [entry, ...filtered.map((c: any) => ({ ...c, active: false }))].slice(0, 6);
    localStorage.setItem('xploura-history', JSON.stringify(updated));
    return updated;
  });
}, [msgs]);

const newChat = () => {
  if (msgs.length > 0) {
    const firstMsg = msgs.find(m => m.type === 'user');
    const title = firstMsg
      ? firstMsg.text.slice(0, 28) + (firstMsg.text.length > 28 ? '…' : '')
      : 'Chat';

    const entry: SavedChat = {
      id: Date.now(),
      title,
      sub: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      active: false,
      messages: msgs,           // ← actual messages save
      savedAt: Date.now(),      // ← timestamp for 2 day check
    };

    setSidebarChats(prev => {
      const updated = [
        entry,
        ...prev.map(c => ({ ...c, active: false }))
      ].slice(0, 2); // ← sirf 2 chats
      localStorage.setItem('xploura-history', JSON.stringify(updated));
      return updated;
    });
  }

  setMsgs([]);
  setChatStarted(false);
  conversationHistoryRef.current = [];
  flowRef.current = { step: null, city: null, category: null, budget: null, crowd: null, lastTopic: null };
};
  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          height: 100%;
          background: #070707;
          color: #EDE8E1;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── PAGE SHELL ── */
        .xa-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: #070707;
        }

        /* ── NAV ── */
        .xa-nav {
          height: 52px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(10,10,10,0.97);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
          position: relative;
          z-index: 20;
          backdrop-filter: blur(12px);
        }
        .xa-nav-left { display: flex; align-items: center; gap: 12px; }
        .xa-toggle-btn {
          width: 28px; height: 28px;
          border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          transition: all 0.2s;
        }
        .xa-toggle-btn:hover {
          background: rgba(255,107,0,0.1);
          border-color: rgba(255,107,0,0.25);
          color: #FF6B00;
        }
        .xa-logo {
          font-family: 'Sora', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #FF6B00;
          text-decoration: none;
          letter-spacing: 0.06em;
        }
        .xa-status {
          display: flex; align-items: center; gap: 6px;
          padding: 3px 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
        }
        .xa-status-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34,197,94,0.8);
          animation: pulse 2.4s ease infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .xa-status-text {
          font-size: 9px; letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.22);
        }
        .xa-back-btn {
          font-size: 10px; letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 5px 13px;
          border-radius: 20px;
          transition: all 0.22s;
          font-family: 'DM Sans', sans-serif;
        }
        .xa-back-btn:hover { color: #FF6B00; border-color: rgba(255,107,0,0.3); }

        /* ── LAYOUT ── */
        .xa-layout { display: flex; flex: 1; overflow: hidden; }

        /* ── SIDEBAR ── */
        .xa-sidebar {
          width: 240px;
          background: rgba(10,10,10,0.95);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column;
          overflow: hidden; flex-shrink: 0;
          transition: width 0.3s ease, opacity 0.25s ease;
        }
        .xa-sidebar.closed { width: 0; opacity: 0; pointer-events: none; }
        .xa-sb-head {
          padding: 14px 13px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .xa-sb-label {
          font-size: 9px; letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          font-weight: 600; margin-bottom: 9px;
        }
        .xa-new-chat-btn {
          width: 100%; padding: 8px 13px;
          background: #FF6B00; color: #fff;
          border: none; border-radius: 8px;
          font-size: 11px; letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .xa-new-chat-btn:hover { background: #FF8333; transform: translateY(-1px); }
        .xa-sb-chats {
          flex: 1; overflow-y: auto;
          padding: 7px 6px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.06) transparent;
        }
        .xa-sb-chats::-webkit-scrollbar { width: 3px; }
        .xa-sb-chats::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 3px; }
        .xa-chat-row {
          padding: 7px 10px; border-radius: 7px;
          cursor: pointer; transition: all 0.16s;
          margin-bottom: 1px;
          border-left: 2px solid transparent;
        }
        .xa-chat-row:hover { background: rgba(255,255,255,0.03); }
        .xa-chat-row.active {
          background: rgba(255,107,0,0.08);
          border-left-color: #FF6B00;
        }
        .xa-chat-title {
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.6);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .xa-chat-row.active .xa-chat-title { color: #FF8C35; }
        .xa-chat-sub { font-size: 10px; color: rgba(255,255,255,0.2); }
        .xa-sb-foot {
          padding: 11px 13px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .xa-quick-label {
          font-size: 9px; letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.16);
          font-weight: 600; margin-bottom: 7px;
        }
        .xa-quick-item {
          width: 100%; padding: 6px 10px;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 7px;
          font-size: 11px; color: rgba(255,255,255,0.3);
          cursor: pointer; transition: all 0.16s;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          text-align: left; margin-bottom: 4px;
          display: block;
        }
        .xa-quick-item:hover {
          border-color: rgba(255,107,0,0.3);
          color: #FF8C35;
          background: rgba(255,107,0,0.04);
        }

        /* ── MAIN AREA ── */
        .xa-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        /* ── MESSAGES ── */
        .xa-messages {
          flex: 1; overflow-y: auto;
          padding: 20px 0 10px;
          scroll-behavior: smooth;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.05) transparent;
        }
        .xa-messages::-webkit-scrollbar { width: 4px; }
        .xa-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 4px; }

        /* ── WELCOME ── */
        .xa-welcome {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          height: 100%; padding: 32px 20px;
          text-align: center;
          animation: fadeUp 0.45s ease;
        }

       .xa-welcome { position: relative; overflow: hidden; }
.xa-welcome::before {
content: '';
position: absolute;
top: -120px; left: 50%; transform: translateX(-50%);
width: 700px; height: 500px;
background: radial-gradient(ellipse, rgba(255,107,0,0.14) 0%, transparent 68%);
pointer-events: none; z-index: 0;
}
.xa-welcome > * { position: relative; z-index: 1; }
        /* Ruixen-style pill actions */
        .xa-pill-grid {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 10px;
          max-width: 560px; margin-top: 28px;
        }
        .xa-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.72);
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .xa-pill:hover {
background: rgba(120,80,220,0.12);
border-color: rgba(140,100,240,0.5);
color: #c4aaff;
box-shadow: 0 4px 16px rgba(120,80,220,0.12);
}
        .xa-pill-icon { font-size: 17px; line-height: 1; }
        .xa-input-center {
          width: 100%; max-width: 640px;
          background: rgba(20,20,20,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
border-radius: 20px;
background: rgba(255,255,255,0.04);
backdrop-filter: blur(20px);
          padding: 14px 14px 12px 18px;
          margin-top: 24px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .xa-input-center:focus-within {
          border-color: rgba(255,107,0,0.45);
          box-shadow: 0 0 0 3px rgba(255,107,0,0.06);
        }
        .xa-center-textarea {
          width: 100%; background: transparent;
          border: none; outline: none;
          color: rgba(255,255,255,0.86);
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          resize: none; min-height: 26px; max-height: 120px;
          line-height: 1.6; caret-color: #FF6B00;
        }
        .xa-center-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .xa-center-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 10px;
        }
        .xa-center-hint {
          font-size: 10px; color: rgba(255,255,255,0.16);
          letter-spacing: 0.04em;
        }
        .xa-center-send {
          width: 34px; height: 34px; border-radius: 9px;
          background: #FF6B00; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s; flex-shrink: 0;
        }
        .xa-center-send:hover { background: #FF8333; transform: scale(1.06); }
        .xa-center-send:disabled { opacity: 0.25; cursor: not-allowed; transform: none; }
        .xa-center-send svg {
          width: 14px; height: 14px; stroke: #fff; fill: none;
          stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .xa-orb {
          width: 68px; height: 68px; border-radius: 50%;
          background: #FF6B00;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          font-family: 'Sora', sans-serif;
          font-size: 24px; font-weight: 700; color: #fff;
          animation: orbPulse 3.5s ease infinite;
        }
        @keyframes orbPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,107,0,0.35), 0 0 28px rgba(255,107,0,0.18); }
          50% { box-shadow: 0 0 0 14px rgba(255,107,0,0), 0 0 50px rgba(255,107,0,0.32); }
        }
        .xa-welcome-title {
          font-family: 'Sora', sans-serif;
          font-size: 26px; font-weight: 700;
          color: #EDE8E1; margin-bottom: 8px;
          letter-spacing: -0.015em;
        }

        .xa-brand { margin-bottom: 12px; }
.xa-brand-name {
font-family: 'Sora', sans-serif;
font-size: 42px; font-weight: 700;
color: #EDE8E1; letter-spacing: -0.02em;
}
        .xa-welcome-sub {
          font-size: 15px; color: rgba(255,255,255,0.45);
font-weight: 400; margin-bottom: 32px;
          line-height: 1.8; max-width: 340px; margin-bottom: 28px;
        }
        .xa-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 8px; max-width: 420px; width: 100%;
        }
        .xa-card {
          padding: 12px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 11px;
          cursor: pointer; transition: all 0.2s; text-align: left;
        }
        .xa-card:hover {
          border-color: rgba(255,107,0,0.38);
          background: rgba(255,107,0,0.045);
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(255,107,0,0.09);
        }
        .xa-card-icon { font-size: 17px; margin-bottom: 6px; }
        .xa-card-title { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.8); margin-bottom: 2px; }
        .xa-card-sub { font-size: 10px; color: rgba(255,255,255,0.28); line-height: 1.4; }

        /* ── MSG ROWS ── */
        .xa-row {
          padding: 4px 20px;
          display: flex; gap: 10px;
          max-width: 780px; margin: 0 auto; width: 100%;
          animation: msgIn 0.26s ease;
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .xa-row.user { flex-direction: row-reverse; }
        .xa-av {
          width: 28px; height: 28px; border-radius: 50%;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; margin-top: 5px;
        }
        .xa-av.ai {
          background: #FF6B00; color: #fff;
          font-family: 'Sora', sans-serif; font-size: 12px;
          box-shadow: 0 0 10px rgba(255,107,0,0.3);
        }
        .xa-av.user {
          background: #181818; color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .xa-msg-wrap { flex: 1; max-width: 600px; }
        .xa-row.user .xa-msg-wrap { display: flex; flex-direction: column; align-items: flex-end; }
        .xa-bubble {
          padding: 10px 14px; border-radius: 13px;
          font-size: 14px; line-height: 1.8;
          max-width: 100%; white-space: pre-wrap; word-break: break-word;
        }
        .xa-bubble.ai {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.065);
          color: rgba(255,255,255,0.84);
          border-radius: 3px 13px 13px 13px;
        }
        .xa-bubble.user {
          background: #FF6B00; color: #fff;
          border-radius: 13px 3px 13px 13px;
        }
        .xa-time {
          font-size: 9px; color: rgba(255,255,255,0.16);
          margin-top: 5px; padding: 0 2px; letter-spacing: 0.04em;
        }
        .xa-row.user .xa-time { text-align: right; }

        /* ── CHIPS ── */
        .xa-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .xa-chip {
          padding: 5px 11px;
          border: 1px solid rgba(255,107,0,0.25);
          border-radius: 20px;
          font-size: 11px; color: rgba(255,107,0,0.82);
          cursor: pointer; transition: all 0.16s;
          background: rgba(255,107,0,0.045);
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          white-space: nowrap;
        }
        .xa-chip:hover { background: #FF6B00; color: #fff; border-color: #FF6B00; transform: translateY(-1px); }

        /* ── TYPING ── */
        .xa-typing {
          padding: 4px 20px;
          display: flex; gap: 10px;
          max-width: 780px; margin: 0 auto; width: 100%;
        }
        .xa-typing-bub {
          padding: 10px 14px;
          background: #141414;
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 3px 13px 13px 13px;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .xa-dots { display: flex; gap: 4px; align-items: center; }
        .xa-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,107,0,0.55);
          animation: dotBounce 1.3s ease infinite;
        }
        .xa-dot:nth-child(2) { animation-delay: 0.14s; }
        .xa-dot:nth-child(3) { animation-delay: 0.28s; }
        @keyframes dotBounce {
          0%,60%,100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .xa-typing-lbl {
          font-size: 11px; color: rgba(255,255,255,0.25);
          font-style: italic; letter-spacing: 0.02em;
        }

        /* ── VOICE BAR ── */
        .xa-voice-bar {
          padding: 9px 20px;
          background: rgba(239,68,68,0.065);
          border-top: 1px solid rgba(239,68,68,0.12);
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0; animation: slideUp 0.2s ease;
        }
        @keyframes slideUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        .xa-wave { display: flex; gap: 3px; align-items: center; }
        .xa-wv {
          width: 3px; border-radius: 3px;
          background: #ef4444;
          animation: waveAnim 0.7s ease infinite;
        }
        .xa-wv:nth-child(1){height:7px;animation-delay:0s}
        .xa-wv:nth-child(2){height:15px;animation-delay:0.1s}
        .xa-wv:nth-child(3){height:10px;animation-delay:0.2s}
        .xa-wv:nth-child(4){height:18px;animation-delay:0.05s}
        .xa-wv:nth-child(5){height:8px;animation-delay:0.15s}
        @keyframes waveAnim { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(1)} }
        .xa-voice-status { font-size: 11px; color: #ef4444; font-weight: 600; white-space: nowrap; }
        .xa-voice-interim {
          flex: 1; font-size: 12px; color: rgba(255,255,255,0.38);
          font-style: italic; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
        }
        .xa-cancel-btn {
          font-size: 10px; color: rgba(255,255,255,0.26);
          cursor: pointer; padding: 4px 9px;
          border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;
          background: transparent; font-family: 'DM Sans', sans-serif;
          transition: all 0.16s; white-space: nowrap;
        }
        .xa-cancel-btn:hover { color: #fff; border-color: rgba(255,255,255,0.22); }

        /* ── INPUT AREA ── */
        .xa-input-area {
          padding: 12px 20px 16px;
          background: rgba(10,10,10,0.97);
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .xa-input-wrap { max-width: 780px; margin: 0 auto; }
        .xa-input-row {
          display: flex; align-items: flex-end; gap: 7px;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 8px 8px 8px 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .xa-input-row:focus-within {
          border-color: rgba(255,107,0,0.4);
          box-shadow: 0 0 0 3px rgba(255,107,0,0.055);
        }
        .xa-textarea {
          flex: 1; background: transparent; border: none; outline: none;
          color: rgba(255,255,255,0.86);
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          resize: none; min-height: 22px; max-height: 140px;
          line-height: 1.6; padding: 0;
          caret-color: #FF6B00;
        }
        .xa-textarea::placeholder { color: rgba(255,255,255,0.18); }
        .xa-btn-row { display: flex; gap: 5px; align-items: center; flex-shrink: 0; }
        .xa-mic {
          width: 33px; height: 33px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 14px; transition: all 0.18s; color: rgba(255,255,255,0.32);
        }
        .xa-mic:hover { border-color: rgba(255,107,0,0.3); background: rgba(255,107,0,0.07); color: #FF8C35; }
        .xa-mic.on {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.38); color: #ef4444;
          animation: micRing 1s ease infinite;
        }
        @keyframes micRing {
          0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.3)}
          50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}
        }
        .xa-send {
          width: 33px; height: 33px; border-radius: 8px;
          background: #FF6B00; border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.18s; flex-shrink: 0;
        }
        .xa-send:hover { background: #FF8333; transform: scale(1.05); }
        .xa-send:disabled { opacity: 0.28; cursor: not-allowed; transform: none; }
        .xa-send svg {
          width: 14px; height: 14px; stroke: #fff; fill: none;
          stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
        }
        .xa-hint {
          font-size: 9px; color: rgba(255,255,255,0.14);
          text-align: center; margin-top: 7px; letter-spacing: 0.04em;
        }

      @media (max-width: 660px) {
  .xa-sidebar {
    position: fixed !important;
    top: 52px !important;
    left: 0 !important;
    height: calc(100vh - 52px) !important;
    z-index: 100 !important;
    width: 240px !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    transform: translateX(-100%);
    transition: transform 0.28s ease !important;
  }
  .xa-sidebar:not(.closed) {
    transform: translateX(0) !important;
  }
  .xa-sidebar.closed {
    transform: translateX(-100%) !important;
    width: 240px !important;
    opacity: 1 !important;
  }

   .xa-model-badge {
  width: 33px;
  height: 33px;
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: 'DM Sans', sans-serif;
}
body {
  padding-top: 0 !important;
}
      `}</style>

      <div className="xa-page">
        {/* NAV */}
        <nav className="xa-nav">
          <div className="xa-nav-left">
            <button className="xa-toggle-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle sidebar">
              ☰
            </button>
            <a href="/" className="xa-logo">Xploura</a>
            <div className="xa-status">
              <div className="xa-status-dot" />
              <span className="xa-status-text">AI · Pune Guide</span>
            </div>
          </div>
          <a href="/" className="xa-back-btn">← Explore</a>
        </nav>

        <div className="xa-layout">
          {/* SIDEBAR */}
          <aside className={`xa-sidebar${sidebarOpen ? '' : ' closed'}`}>
            <div className="xa-sb-head">
              <div className="xa-sb-label">Conversations</div>
              <button className="xa-new-chat-btn" onClick={newChat}>+ New Chat</button>
            </div>
            <div className="xa-sb-chats">
              {sidebarChats.map(c => (
                <div
                  key={c.id}
                  className={`xa-chat-row${c.active ? ' active' : ''}`}
                  onClick={() => {
  const chat = sidebarChats.find(p => p.id === c.id) as SavedChat;
  if (chat?.messages?.length > 0) {
    setMsgs(chat.messages);
    setChatStarted(true);
    conversationHistoryRef.current = chat.messages.map(m => ({
      role: m.type === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }));
  }
  setSidebarChats(prev => prev.map(p => ({ ...p, active: p.id === c.id })));
}}
                >
                  <div className="xa-chat-title">{c.title}</div>
                  <div className="xa-chat-sub">{c.sub}</div>
                </div>
              ))}
            </div>
            <div className="xa-sb-foot">
              <div className="xa-quick-label">Quick asks</div>
              {QUICK_ACTIONS.map((a, i) => (
  <button key={i} className="xa-quick-item" onClick={() => quickAsk(a.query, a.cat)}>
    <i className={`ti ${a.icon}`} style={{ fontSize: '13px', opacity: 0.7 }} />
    {a.label}
  </button>
))}
            </div>
          </aside>

          {/* MAIN */}
          <main className="xa-main">
            <div className="xa-messages" ref={messagesRef}>
              {!chatStarted ? (
                <div className="xa-welcome">
                  <div className="xa-brand">
<span className="xa-brand-name">Xploura AI</span>
</div>
                  <p className="xa-welcome-sub">
Build something amazing — just start typing below.
</p>

                  {/* Ruixen-style centered input */}
                  <div className="xa-input-center">
                    <textarea
                      className="xa-center-textarea"
                      value={input}
                      rows={1}
                      onChange={e => { setInput(e.target.value); autoResize(); }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                      }}
                      placeholder="Where to go? What to do? Let's plan…"
                    />
                    <div className="xa-center-footer">
  <span className="xa-center-hint">enter to send · shift+enter new line</span>
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <button className="xa-mic" style={{ cursor: 'default', fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)' }}>
  X-1.1
</button>
    {micSupported && (
      <button
        className={`xa-mic${isListening ? ' on' : ''}`}
        onClick={isListening ? stopListening : startListening}
        aria-label={isListening ? 'Stop' : 'Speak'}
        title={isListening ? 'Stop listening' : 'Voice input'}
      >
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="8" y1="22" x2="16" y2="22"/>
  </svg>
</button>
    )}
    <button
      className="xa-center-send"
      onClick={() => sendMessage()}
      disabled={typing || !input.trim()}
    >
      <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </div>
</div>
</div>  

                  {/* Pill quick actions */}
                  <div className="xa-pill-grid">
                    {[
                      { icon: 'ti-coffee', label: 'Best Cafes', query: 'Best cafes in Pune?', cat: 'cafe' },
{ icon: 'ti-heart', label: 'Date Night', query: 'Plan a date night in Pune', cat: 'date' },
{ icon: 'ti-car', label: 'Weekend Trip', query: 'Best weekend trips from Pune', cat: 'travel' },
{ icon: 'ti-bolt', label: 'Adventure', query: 'Adventure activities near Pune', cat: 'adventure' },
{ icon: 'ti-tools-kitchen-2', label: 'Restaurants', query: 'Best restaurants in Pune', cat: 'restaurant'},
{ icon: 'ti-sunrise', label: 'Sunrise Spots', query: 'Best sunrise spots near Pune', cat: 'travel' },
                    ].map((a, i) => (
                      <button key={i} className="xa-pill" onClick={() => quickAsk(a.query, a.cat)}>
                       <i className={`ti ${a.icon} xa-pill-icon`} aria-hidden="true" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {msgs.map(m => (
                    <div key={m.id} className={`xa-row ${m.type}`}>
                      <div className={`xa-av ${m.type}`}>{m.type === 'ai' ? 'X' : 'U'}</div>
                      <div className="xa-msg-wrap">
                        <div className={`xa-bubble ${m.type}`}>{m.text}</div>
                        {m.chips && m.chips.length > 0 && (
                          <div className="xa-chips">
                            {m.chips.map((c, j) => (
                              <button key={j} className="xa-chip" onClick={() => quickAsk(c)}>{c}</button>
                            ))}
                          </div>
                        )}
                        <div className="xa-time">{m.time}</div>
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="xa-typing">
                      <div className="xa-av ai">X</div>
                      <div>
                        <div className="xa-typing-bub">
                          <div className="xa-dots">
                            <div className="xa-dot" /><div className="xa-dot" /><div className="xa-dot" />
                          </div>
                          <span className="xa-typing-lbl">{typingLabel}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* VOICE BAR */}
            {isListening && (
              <div className="xa-voice-bar">
                <div className="xa-wave">
                  {[0,1,2,3,4].map(i => <div key={i} className="xa-wv" />)}
                </div>
                <span className="xa-voice-status">Listening…</span>
                <span className="xa-voice-interim">{interimText || 'Say something…'}</span>
                <button className="xa-cancel-btn" onClick={stopListening}>Cancel</button>
              </div>
            )}

            {/* INPUT */}
            {chatStarted && (
<div className="xa-input-area">
              <div className="xa-input-wrap">
                <div className="xa-input-row">
                  <textarea
                    ref={textareaRef}
                    className="xa-textarea"
                    value={input}
                    onChange={e => { setInput(e.target.value); autoResize(); }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                    }}
                    placeholder="Ask about cafes, trips, dates, restaurants in Pune…"
                    rows={1}
                  />
                  <div className="xa-btn-row">
  <span className="xa-model-badge">
    X-1.1
  </span>
  {micSupported && (
                      <button
                        className={`xa-mic${isListening ? ' on' : ''}`}
                        onClick={isListening ? stopListening : startListening}
                        aria-label={isListening ? 'Stop' : 'Speak'}
                        title={isListening ? 'Stop listening' : 'Voice input'}
                      >
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="8" y1="22" x2="16" y2="22"/>
  </svg>
</button>
                    )}
                    <button
                      className="xa-send"
                      onClick={() => sendMessage()}
                      disabled={typing || !input.trim()}
                      aria-label="Send"
                    >
                      <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
                <div className="xa-hint">
                  {micSupported ? '🎙️ tap mic · enter to send · shift+enter new line' : 'enter to send · shift+enter new line'}
                </div>
              </div>
            </div>
            )}
          </main>
        </div>
      </div>
    </>
                  
  );
}