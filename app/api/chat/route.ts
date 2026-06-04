import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // ← YE ADD KARO — key check
  if (!process.env.GROQ_KEY) {
    return NextResponse.json(
      { error: 'GROQ_KEY missing', choices: [] },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.GROQ_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: 'API call failed', choices: [] },
      { status: 500 }
    );
  }
}