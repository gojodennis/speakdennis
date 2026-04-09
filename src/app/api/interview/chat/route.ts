import { NextRequest, NextResponse } from 'next/server';
import { nim, NIM_MODELS } from '@/lib/ai/nvidia-client';

export const maxDuration = 60;

const INTERVIEWER_SYSTEM_PROMPT = `You are an expert hiring manager conducting a professional job interview.
Your goal is to assess the candidate's skills, experience, and cultural fit through a conversational exchange.

Guidelines:
1. Speak in a professional, encouraging, but concise manner.
2. Ask one clear question at a time. Do not overwhelm the candidate with multiple questions at once.
3. React naturally to what the candidate says before moving to the next question.
4. Keep your responses short (2-4 sentences max) as they will be read aloud by text-to-speech.
5. If the candidate gives a very short answer, prompt them to elaborate.
6. When you feel the interview has reached a natural conclusion (around 4-6 exchanges), end the interview gracefully.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey || apiKey === 'nvapi-your-key-here') {
    return NextResponse.json(
      { error: 'NVIDIA_NIM_API_KEY is not configured. Add it to .env.local.' },
      { status: 503 },
    );
  }

  try {
    const body = await req.json() as {
      messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
    };

    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    // Ensure system prompt is explicitly set if not present
    const chatMessages = messages[0]?.role === 'system' 
      ? messages 
      : [{ role: 'system', content: INTERVIEWER_SYSTEM_PROMPT } as const, ...messages];

    const response = await nim.chat.completions.create({
      model: NIM_MODELS.ANALYZE, // Llama-3.1-8B-Instruct is great for fast chat
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 250,
    });

    const reply = response.choices[0]?.message?.content ?? '';

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error('[/api/interview/chat] Error:', err);
    const message = (err as Error)?.message ?? 'Chat failed.';
    const status = (err as { status?: number })?.status ?? 500;
    return NextResponse.json({ error: message }, { status });
  }
}
