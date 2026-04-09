import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpeech } from '@/lib/ai/analyze';

export const maxDuration = 60;

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
      scenarioName: string;
      durationSeconds: number; // Total user speaking time across all turns
      wordCount: number; // Total user words across all turns
    };

    const { messages, scenarioName, durationSeconds, wordCount } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is empty.' }, { status: 400 });
    }

    // Filter out system prompts and build a readable transcript
    const conversationLog = messages
      .filter(m => m.role !== 'system')
      .map(m => {
        const speaker = m.role === 'assistant' ? 'Interviewer' : 'Candidate';
        return `${speaker}: ${m.content}`;
      })
      .join('\n\n');

    const feedback = await analyzeSpeech({
      transcript: conversationLog,
      scenarioName: `Conversational Mode: ${scenarioName}`,
      scenarioPrompt: 'A full back-and-forth conversational interview. Analyze the candidate\'s responses for pace, filler words, grammar, and overall structure contextually.',
      durationSeconds,
      wordCount,
    });

    return NextResponse.json({ feedback, transcript: conversationLog });
  } catch (err: unknown) {
    console.error('[/api/interview/analyze] Error:', err);
    const message = (err as Error)?.message ?? 'Analysis failed.';
    const status = (err as { status?: number })?.status ?? 500;
    return NextResponse.json({ error: message }, { status });
  }
}
