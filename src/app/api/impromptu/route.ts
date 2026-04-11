import { NextRequest, NextResponse } from 'next/server';
import { nim, NIM_MODELS } from '@/lib/ai/nvidia-client';

export const maxDuration = 10;

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
      type: 'one_word' | 'two_word' | 'one_sentence';
    };

    const { type } = body;

    let instruction = '';
    switch (type) {
      case 'one_word':
        instruction = 'Generate exactly one single valid English word that would make an interesting topic for an impromptu speech. Do not include any punctuation, quotes, or trailing spaces. Response should be just the word itself.';
        break;
      case 'two_word':
        instruction = 'Generate exactly two valid English words that form an interesting concept or phrase for an impromptu speech. Do not include any punctuation, quotes, or trailing spaces. Response should be just the two words separated by a space.';
        break;
      case 'one_sentence':
        instruction = 'Generate exactly one short, thought-provoking sentence that would make an interesting prompt for an impromptu speech. Do not include any quotes. Response should be just the sentence itself.';
        break;
      default:
        return NextResponse.json({ error: 'Invalid challenge type.' }, { status: 400 });
    }

    const response = await nim.chat.completions.create({
      model: NIM_MODELS.ANALYZE,
      messages: [
        { role: 'system', content: 'You are a creative speaking coach providing challenging, interesting impromptu speaking topics.' },
        { role: 'user', content: instruction },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const content = response.choices[0]?.message?.content?.trim() ?? '';

    return NextResponse.json({ topic: content });
  } catch (err: unknown) {
    console.error('[/api/impromptu] Error:', err);
    const message = (err as Error)?.message ?? 'Topic generation failed.';
    const status = (err as { status?: number })?.status ?? 500;
    return NextResponse.json({ error: message }, { status });
  }
}
