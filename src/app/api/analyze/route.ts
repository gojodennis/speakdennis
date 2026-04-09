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
      transcript: string;
      scenarioName: string;
      scenarioPrompt: string;
      durationSeconds: number;
      wordCount: number;
    };

    const { transcript, scenarioName, scenarioPrompt, durationSeconds, wordCount } = body;

    if (!transcript?.trim()) {
      return NextResponse.json({ error: 'Transcript is empty.' }, { status: 400 });
    }

    const feedback = await analyzeSpeech({
      transcript,
      scenarioName,
      scenarioPrompt,
      durationSeconds,
      wordCount,
    });

    return NextResponse.json({ feedback });
  } catch (err: unknown) {
    console.error('[/api/analyze] Error:', err);
    const message = (err as Error)?.message ?? 'Analysis failed.';
    const status = (err as { status?: number })?.status ?? 500;
    return NextResponse.json({ error: message }, { status });
  }
}
