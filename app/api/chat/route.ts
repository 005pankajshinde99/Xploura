import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  console.log('GROQ_KEY exists:', !!process.env.GROQ_KEY);
  
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log('Groq response status:', res.status);
  console.log('Groq response:', JSON.stringify(data).slice(0, 200));
  
  return NextResponse.json(data);
}