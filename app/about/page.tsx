'use client';
import Navbar from '../components/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar active="about" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; padding-top: 70px; }

        :root {
          --black: #0a0908;
          --white: #FAFAF8;
          --saffron: #FF6B00;
          --saffronL: #FF8C35;
        }

        /* ── HERO ── */
        .about-hero {
          position: relative;
          height: 70vh;
          min-height: 480px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: var(--black);
        }
        .about-hero-bg {
          position: absolute; inset: 0;
          background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=90') center/cover;
          filter: brightness(0.28) saturate(0.6);
          transform: scale(1.05);
        }
        .about-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(10,9,8,0.2) 0%, rgba(10,9,8,0.1) 30%, rgba(10,9,8,0.7) 70%, rgba(10,9,8,1) 100%);
        }
        .about-hero-inner {
          position: relative; z-index: 10;
          padding: 0 64px 56px;
          max-width: 800px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,107,0,0.8); margin-bottom: 18px;
          border: 0.5px solid rgba(255,107,0,0.25);
          padding: 5px 12px; border-radius: 20px;
          background: rgba(255,107,0,0.06);
        }
        .hero-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--saffron);
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }

        .about-hero-h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 7vw, 100px);
          line-height: 0.9;
          letter-spacing: 0.02em;
          color: #fff;
          margin-bottom: 20px;
        }
        .about-hero-h1 em { font-style: normal; color: var(--saffron); }
        .about-hero-sub {
          font-size: 14px; line-height: 1.85;
          color: rgba(255,255,255,0.38);
          max-width: 440px;
        }

        /* ── STORY ── */
        .about-story {
          background: var(--white);
          padding: 80px 64px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .story-label {
          font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--saffron); margin-bottom: 14px; font-weight: 500;
        }
        .story-h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 4vw, 56px);
          line-height: 0.92; letter-spacing: 0.02em;
          color: var(--black); margin-bottom: 22px;
        }
        .story-h2 span { color: rgba(0,0,0,0.12); }
        .story-body {
          font-size: 14px; line-height: 1.9;
          color: rgba(0,0,0,0.48);
        }
        .story-body p { margin-bottom: 16px; }
        .story-quote {
          border-left: 2px solid var(--saffron);
          padding: 4px 0 4px 18px;
          font-size: 15px; font-style: italic;
          color: rgba(0,0,0,0.6); line-height: 1.7;
          margin: 22px 0; font-weight: 300;
        }
        .story-right { position: relative; }
        .story-img-wrap {
          position: relative; height: 420px;
          border-radius: 4px; overflow: hidden;
        }
        .story-img {
          width: 100%; height: 100%; object-fit: cover;
          filter: grayscale(30%) brightness(0.9);
          transition: filter 0.5s, transform 0.6s;
        }
        .story-img-wrap:hover .story-img { filter: grayscale(0%) brightness(1); transform: scale(1.03); }
        .story-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
        }
        .story-img-caption {
          position: absolute; bottom: 18px; left: 20px; right: 20px;
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .story-float-badge {
          position: absolute; top: -16px; right: -16px;
          width: 84px; height: 84px;
          background: var(--saffron); border-radius: 50%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          box-shadow: 0 10px 32px rgba(255,107,0,0.35); z-index: 5;
        }
        .sfb-num { font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: #fff; line-height: 1; }
        .sfb-label { font-size: 6px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.75); text-align: center; padding: 0 6px; }

        /* ── STATS ── */
        .about-stats {
          background: var(--black);
          display: grid; grid-template-columns: repeat(4,1fr);
          border-top: 0.5px solid rgba(255,107,0,0.2);
          border-bottom: 0.5px solid rgba(255,107,0,0.2);
        }
        .astat {
          padding: 40px 32px;
          border-right: 0.5px solid rgba(255,255,255,0.05);
          position: relative; overflow: hidden;
        }
        .astat:last-child { border-right: none; }
        .astat::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, var(--saffron), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .astat:hover::before { opacity: 1; }
        .astat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 52px; line-height: 1; letter-spacing: 0.02em; margin-bottom: 6px;
        }
        .astat-num span { color: var(--saffron); }
        .astat-num em { font-style: normal; color: rgba(255,255,255,0.9); }
        .astat-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.28); }

        /* ── VALUES ── */
        .about-values { background: var(--white); padding: 80px 64px; }
        .values-top {
          display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 40px;
        }
        .values-h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 4vw, 56px);
          line-height: 0.92; letter-spacing: 0.02em; color: var(--black);
        }
        .values-h2 span { color: rgba(0,0,0,0.12); }
        .values-desc { max-width: 280px; font-size: 12px; color: rgba(0,0,0,0.4); line-height: 1.8; text-align: right; }
        .values-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
        .value-card { position: relative; overflow: hidden; height: 300px; cursor: pointer; }
        .value-card-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          filter: brightness(0.35) saturate(0.5);
          transition: filter 0.5s, transform 0.6s;
        }
        .value-card:hover .value-card-bg { filter: brightness(0.5) saturate(0.8); transform: scale(1.06); }
        .value-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
        }
        .value-card-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 24px; }
        .value-num {
          font-family: 'Bebas Neue', sans-serif; font-size: 56px; line-height: 1;
          color: rgba(255,107,0,0.15); position: absolute; top: 16px; right: 16px;
          letter-spacing: 0.02em; transition: color 0.3s;
        }
        .value-card:hover .value-num { color: rgba(255,107,0,0.3); }
        .value-icon {
          width: 36px; height: 36px;
          border: 0.5px solid rgba(255,107,0,0.3); border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 12px; background: rgba(255,107,0,0.08); transition: background 0.3s;
        }
        .value-card:hover .value-icon { background: rgba(255,107,0,0.2); }
        .value-icon svg { width: 17px; height: 17px; stroke: var(--saffron); fill: none; stroke-width: 1.6; }
        .value-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 0.04em;
          color: #fff; margin-bottom: 8px; line-height: 1;
        }
        .value-body { font-size: 11px; line-height: 1.75; color: rgba(255,255,255,0.45); transition: color 0.3s; }
        .value-card:hover .value-body { color: rgba(255,255,255,0.65); }

        /* ── FOUNDER ── */
        .about-founder { background: var(--white); padding: 0 64px 80px; }
        .founder-inner {
          background: var(--black); border-radius: 4px; overflow: hidden;
          display: grid; grid-template-columns: 1fr 1.6fr;
        }
        /* Left decorative panel — no photo */
        .founder-deco {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #0f0d0b 0%, #1a1410 50%, #0a0908 100%);
          display: flex; align-items: center; justify-content: center;
          min-height: 340px;
        }
        .founder-deco-letter {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 200px; line-height: 1;
          color: rgba(255,107,0,0.06);
          letter-spacing: -0.04em;
          user-select: none;
          position: absolute;
        }
        .founder-deco-badge {
          position: relative; z-index: 2;
          width: 80px; height: 80px; border-radius: 50%;
          border: 1.5px solid rgba(255,107,0,0.3);
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,107,0,0.06);
        }
        .founder-deco-badge svg { width: 36px; height: 36px; stroke: rgba(255,107,0,0.5); fill: none; stroke-width: 1.2; }
        .founder-deco-grid {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: linear-gradient(rgba(255,107,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.5) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .founder-content {
          padding: 48px 48px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .founder-label { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--saffron); margin-bottom: 16px; }
        .founder-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 44px; letter-spacing: 0.03em;
          color: #fff; line-height: 0.9; margin-bottom: 6px;
        }
        .founder-role { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 6px; }
        .founder-address { font-size: 11px; color: rgba(255,107,0,0.55); margin-bottom: 22px; letter-spacing: 0.06em; }
        .founder-bio { font-size: 13px; line-height: 1.85; color: rgba(255,255,255,0.42); margin-bottom: 24px; font-weight: 300; }
        .founder-quote {
          border-left: 2px solid var(--saffron);
          padding: 2px 0 2px 16px;
          font-size: 13px; font-style: italic;
          color: rgba(255,255,255,0.55); line-height: 1.7; font-weight: 300;
        }

        /* ── BLOGS ── */
        .about-blogs { background: var(--black); padding: 80px 64px; }
        .blogs-top { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 40px; }
        .blogs-h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 4vw, 56px);
          line-height: 0.92; letter-spacing: 0.02em; color: #fff;
        }
        .blogs-h2 span { color: rgba(255,255,255,0.1); }
        .blogs-link {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--saffron); text-decoration: none;
          border-bottom: 0.5px solid rgba(255,107,0,0.3); padding-bottom: 2px;
        }
        .blogs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(255,255,255,0.05); }
        .blog-card { background: var(--black); cursor: pointer; transition: background 0.3s; overflow: hidden; }
        .blog-card:hover { background: #141210; }
        .blog-img { height: 190px; overflow: hidden; position: relative; }
        .blog-img img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(60%) brightness(0.7); transition: filter 0.5s, transform 0.6s; }
        .blog-card:hover .blog-img img { filter: grayscale(10%) brightness(0.85); transform: scale(1.06); }
        .blog-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%); }
        .blog-tag { position: absolute; top: 12px; left: 12px; font-size: 8px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--saffron); background: rgba(255,107,0,0.12); border: 0.5px solid rgba(255,107,0,0.25); padding: 3px 9px; border-radius: 20px; }
        .blog-body { padding: 22px 22px 24px; }
        .blog-title { font-family: 'Bebas Neue', sans-serif; font-size: 21px; letter-spacing: 0.04em; color: #fff; line-height: 1.1; margin-bottom: 10px; transition: color 0.3s; }
        .blog-card:hover .blog-title { color: var(--saffron); }
        .blog-excerpt { font-size: 11px; line-height: 1.75; color: rgba(255,255,255,0.32); margin-bottom: 16px; }
        .blog-meta { display: flex; align-items: center; justify-content: space-between; border-top: 0.5px solid rgba(255,255,255,0.06); padding-top: 12px; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
        .blog-read { color: var(--saffron); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; display: flex; align-items: center; gap: 5px; }

        /* ── CTA ── */
        .about-cta { background: var(--black); padding: 0 64px 80px; }
        .cta-inner { position: relative; overflow: hidden; border-radius: 4px; padding: 72px 64px; text-align: center; }
        .cta-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80') center/cover; filter: brightness(0.18) saturate(0.4); }
        .cta-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(255,107,0,0.08) 0%, transparent 70%); }
        .cta-content { position: relative; z-index: 2; }
        .cta-eyebrow { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(255,107,0,0.7); margin-bottom: 16px; display: block; }
        .cta-h2 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(44px, 6vw, 80px); line-height: 0.9; letter-spacing: 0.02em; color: #fff; margin-bottom: 16px; }
        .cta-h2 em { font-style: normal; color: var(--saffron); }
        .cta-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 36px; line-height: 1.7; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .cta-btn-primary { font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; background: var(--saffron); color: #fff; border: none; padding: 13px 30px; border-radius: 2px; cursor: pointer; font-weight: 500; transition: background 0.3s, transform 0.2s; text-decoration: none; display: inline-block; }
        .cta-btn-primary:hover { background: var(--saffronL); transform: translateY(-2px); }
        .cta-btn-ghost { font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; background: transparent; color: rgba(255,255,255,0.5); border: 0.5px solid rgba(255,255,255,0.15); padding: 13px 28px; border-radius: 2px; cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-block; }
        .cta-btn-ghost:hover { border-color: rgba(255,107,0,0.5); color: rgba(255,107,0,0.8); }

        /* ── FOOTER ── */
        .about-footer { background: #050403; padding: 48px 64px 24px; border-top: 0.5px solid rgba(255,255,255,0.05); }
        .footer-top { display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .footer-brand-name { font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 0.1em; margin-bottom: 12px; }
        .footer-brand-name span:first-child { color: var(--saffron); }
        .footer-brand-name span:last-child { color: rgba(255,255,255,0.08); }
        .footer-brand-desc { font-size: 11px; color: rgba(255,255,255,0.22); line-height: 1.85; max-width: 190px; }
        .footer-col-title { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 14px; }
        .footer-links { display: flex; flex-direction: column; gap: 9px; }
        .footer-links a { font-size: 12px; color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.3s; }
        .footer-links a:hover { color: var(--saffron); }
        .footer-bottom { border-top: 0.5px solid rgba(255,255,255,0.05); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; }
        .footer-copy { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.14); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .about-hero-inner { padding: 0 28px 48px; }
          .about-story { grid-template-columns: 1fr; padding: 64px 28px; gap: 40px; }
          .story-right { display: none; }
          .about-stats { grid-template-columns: repeat(2,1fr); }
          .about-values { padding: 64px 28px; }
          .values-top { flex-direction: column; align-items: flex-start; gap: 14px; }
          .values-desc { text-align: left; }
          .values-grid { grid-template-columns: 1fr; }
          .value-card { height: 240px; }
          .about-founder { padding: 0 28px 64px; }
          .founder-inner { grid-template-columns: 1fr; }
          .founder-deco { min-height: 180px; }
          .founder-content { padding: 32px 28px; }
          .about-blogs { padding: 64px 28px; }
          .blogs-grid { grid-template-columns: 1fr; }
          .about-cta { padding: 0 28px 64px; }
          .cta-inner { padding: 52px 28px; }
          .about-footer { padding: 40px 28px 20px; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 28px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-overlay" />
        <div className="about-hero-inner">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" />
            Our Story
          </div>
          <h1 className="about-hero-h1">
            Born From A<br />
            <em>Missed</em> Sunset
          </h1>
          <p className="about-hero-sub">
            One evening we wanted to head to Lonavala. Plans fell through. 
            We missed that sunset. That's when Xploura was born — so no one else misses their moment.
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="about-story">
        <div className="story-left">
          <div className="story-label">The Beginning</div>
          <h2 className="story-h2">
            Every Weekend<br />
            Has A <span>Story</span><br />
            Waiting
          </h2>
          <div className="story-body">
            <p>
              In 2024, in a small apartment in Pune, someone was scrolling through their phone — 
              trying to find somewhere to go, something to do. An hour later, 
              exhausted from searching, they just stayed home.
            </p>
            <div className="story-quote">
              "Time doesn't wait, but we do. Xploura was built so planning 
              becomes effortless — so no one misses another moment."
            </div>
            <p>
              Xploura isn't just a booking platform. It's a promise — that every person 
              in Pune can find their next adventure, next date night, next memory. 
              Easily. Through AI, in conversation, on their terms.
            </p>
          </div>
        </div>
        <div className="story-right">
          <div className="story-float-badge">
            <div className="sfb-num">92K</div>
            <div className="sfb-label">Explorers Trust Us</div>
          </div>
          <div className="story-img-wrap">
            <img className="story-img" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" alt="Mountains" />
            <div className="story-img-overlay" />
            <div className="story-img-caption">Western Ghats · Maharashtra</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="about-stats">
        {[
          { num: '92', suffix: 'K+', label: 'Happy Explorers' },
          { num: '240', suffix: '+', label: 'Destinations Listed' },
          { num: '4.9', suffix: '★', label: 'Average Rating' },
          { num: '18', suffix: 'K', label: 'Events Booked' },
        ].map((s, i) => (
          <div key={i} className="astat">
            <div className="astat-num"><em>{s.num}</em><span>{s.suffix}</span></div>
            <div className="astat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── VALUES ── */}
      <section className="about-values">
        <div className="values-top">
          <div>
            <div className="story-label">What We Believe</div>
            <h2 className="values-h2">Our <span>Three</span><br />Core Values</h2>
          </div>
          <p className="values-desc">
            Nature taught us — everything has its moment. We make sure you don't waste yours.
          </p>
        </div>
        <div className="values-grid">
          {[
            {
              num: '01', title: 'Explore',
              body: 'Every place hides a new world. Mountains, lakes, rooftops — all waiting for you. Just take the first step.',
              bg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
              icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            },
            {
              num: '02', title: 'Experience',
              body: 'Life is in moments, not screenshots. A sunset, a bonfire, a perfect date — these experiences are your real story.',
              bg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
              icon: <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            },
            {
              num: '03', title: 'Escape',
              body: 'Away from the city noise, close to yourself. Nature has always been calling — Xploura makes that path easier.',
              bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
              icon: <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 22"/><path d="M9.1 17.4c-.9-5 2.3-9.9 8-11.4"/><path d="M14.5 5c0-2-1.5-3-3-3s-3 1-3 3 1.5 3 3 3 3-1 3-3z"/></svg>
            },
          ].map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-card-bg" style={{ backgroundImage: `url(${v.bg})` }} />
              <div className="value-card-overlay" />
              <div className="value-num">{v.num}</div>
              <div className="value-card-content">
                <div className="value-icon">{v.icon}</div>
                <div className="value-title">{v.title}</div>
                <div className="value-body">{v.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="about-founder">
        <div className="founder-inner">
          {/* Decorative panel — no photo */}
          <div className="founder-deco">
            <div className="founder-deco-grid" />
            <div className="founder-deco-letter">PS</div>
            <div className="founder-deco-badge">
              <svg viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <div className="founder-content">
            <div className="founder-label">Founder & Chief Explorer</div>
            <div className="founder-name">Pankaj<br />Shinde</div>
            <div className="founder-role">Builder · Explorer</div>
            <div className="founder-address">📍 Katraj, Pune</div>
            <p className="founder-bio">
              Grew up in Pune, always planning weekend getaways that somehow never worked out. 
              One day he realized planning should be simpler — so he decided to fix it. 
              Xploura is that fix.
            </p>
            <div className="founder-quote">
              "I want every person in Pune to have a co-pilot — one that plans 
              their next adventure, handles the booking, and gets them there."
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOGS ── */}
      <section className="about-blogs">
        <div className="blogs-top">
          <div>
            <div className="story-label" style={{ color: 'var(--saffron)' }}>From The Journal</div>
            <h2 className="blogs-h2">Stories Worth<br /><span>Reading</span></h2>
          </div>
          <a href="#" className="blogs-link">All Articles →</a>
        </div>
        <div className="blogs-grid">
          {[
            {
              img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&q=80',
              tag: 'Nature',
              title: '5 Hidden Waterfalls Near Pune You Must Visit',
              excerpt: 'Post-monsoon, the Sahyadri forests hide gems that don\'t even show up on Google Maps.',
              date: 'May 2026', read: '4 min read'
            },
            {
              img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80',
              tag: 'Dates',
              title: 'How to Plan a Perfect Date Night in Pune',
              excerpt: 'From rooftop restaurants to candlelit cafes — a guide that actually works.',
              date: 'May 2026', read: '5 min read'
            },
            {
              img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=700&q=80',
              tag: 'Solo Travel',
              title: 'Why Solo Trips Change You Forever',
              excerpt: 'Spending time with yourself isn\'t weakness — it\'s self-discovery. An honest account.',
              date: 'Apr 2026', read: '6 min read'
            },
          ].map((b, i) => (
            <div key={i} className="blog-card">
              <div className="blog-img">
                <img src={b.img} alt={b.title} />
                <div className="blog-img-overlay" />
                <div className="blog-tag">{b.tag}</div>
              </div>
              <div className="blog-body">
                <div className="blog-title">{b.title}</div>
                <div className="blog-excerpt">{b.excerpt}</div>
                <div className="blog-meta">
                  <span>{b.date}</span>
                  <span className="blog-read">
                    {b.read}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="cta-inner">
          <div className="cta-bg" />
          <div className="cta-overlay" />
          <div className="cta-content">
            <span className="cta-eyebrow">Your Next Chapter</span>
            <h2 className="cta-h2">Your Next Story<br />Starts <em>Here</em></h2>
            <p className="cta-sub">
              Don't miss that sunset. Don't postpone that trip.<br />
              Xploura is here — plan, book, go.
            </p>
            <div className="cta-btns">
              <a href="/" className="cta-btn-primary">Plan My Adventure →</a>
              <a href="/ai-agent" className="cta-btn-ghost">Meet X AI</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="about-footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name"><span>X</span><span>PLOURA</span></div>
            <p className="footer-brand-desc">Explore the world with AI — travel, events, sports, dining in one place.</p>
          </div>
          {[
            { title: 'Explore', links: ['Travel & Trips', 'Date Nights', 'Adventure', 'Cafes & Dining'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog'] },
            { title: 'Contact', links: ['hello@xploura.in', 'Instagram', 'Twitter / X', 'LinkedIn'] },
          ].map(col => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <div className="footer-links">{col.links.map(l => <a key={l} href="#">{l}</a>)}</div>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Xploura. All rights reserved.</span>
          <span className="footer-copy">Built with passion in Pune, India</span>
        </div>
      </footer>
    </>
  );
}