'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabase = createClient(
  'https://ttbheiwtysickbyasulr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmhlaXd0eXNpY2tieWFzdWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDAxMzMsImV4cCI6MjA5NDA3NjEzM30.4qdV5Pyl9EgTzYqJGL_xSRGg9_BSlO01rw_6lCzcLRs'
);

export default function Bookings() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    _supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (!u) { window.location.href = '/auth'; return; }
      fetchBookings(u.id);
    });
  }, []);

  async function fetchBookings(userId: string) {
    const { data } = await _supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0d0b',
      padding: '100px 24px 40px',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <a href="/" style={{
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </a>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF6B00', marginBottom: 8 }}>My Account</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 42,
          color: '#fff', letterSpacing: '0.06em', margin: 0, lineHeight: 1
        }}>My Bookings</h1>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
          Loading...
        </div>
      ) : bookings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: 16, color: 'rgba(255,255,255,0.3)'
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎟️</div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>No bookings yet</div>
          <div style={{ fontSize: 13, marginBottom: 24 }}>Start exploring Pune and book your first experience!</div>
          <a href="/" style={{
            background: '#FF6B00', color: '#fff', padding: '12px 28px',
            borderRadius: 24, textDecoration: 'none', fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>Explore Now</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookings.map((b, i) => (
            <div key={i} style={{
              background: '#1a1714', border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: 16, color: '#fff', fontWeight: 500, marginBottom: 4 }}>{b.name || 'Booking'}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </div>
              </div>
              <div style={{
                fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '5px 12px', borderRadius: 20,
                background: b.status === 'confirmed' ? 'rgba(0,200,100,0.12)' : 'rgba(255,107,0,0.12)',
                color: b.status === 'confirmed' ? '#00c864' : '#FF6B00',
                border: `0.5px solid ${b.status === 'confirmed' ? 'rgba(0,200,100,0.3)' : 'rgba(255,107,0,0.3)'}`
              }}>
                {b.status || 'Pending'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
