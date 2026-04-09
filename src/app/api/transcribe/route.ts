import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const GROQ_BASE = 'https://api.groq.com/openai/v1';
const RATE_LIMIT_STATUS = 429;
const MAX_RETRIES = 2;

async function callGroqWhisper(audioBlob: Blob, mimeType: string, apiKey: string, attempt = 0): Promise<string> {
  const form = new FormData();
  form.append('file', new File([audioBlob], 'recording.wav', { type: mimeType }));
  form.append('model', 'whisper-large-v3-turbo');
  form.append('response_format', 'text');

  const res = await fetch(`${GROQ_BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!res.ok) {
    const status = res.status;

    // Rate limit — retry with backoff
    if (status === RATE_LIMIT_STATUS && attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      return callGroqWhisper(audioBlob, mimeType, apiKey, attempt + 1);
    }

    const body = await res.text().catch(() => '');
    let detail = body;
    try {
      const json = JSON.parse(body) as { error?: { message?: string } };
      detail = json.error?.message ?? body;
    } catch {
      // body was not JSON
    }

    throw Object.assign(new Error(detail || `Groq error ${status}`), { status });
  }

  // With response_format='text', Groq returns the raw transcript text directly.
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const json = await res.json() as { text?: string };
    return json.text ?? '';
  }
  return (await res.text()).trim();
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'gsk_your-key-here') {
    return NextResponse.json(
      { error: 'GROQ_API_KEY is not configured. Add it to .env.local.' },
      { status: 503 },
    );
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 });
    }
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio file too large (max 25 MB).' }, { status: 413 });
    }

    const mimeType = audioFile.type || 'audio/webm';
    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: mimeType });

    const transcript = await callGroqWhisper(audioBlob, mimeType, apiKey);
    return NextResponse.json({ transcript });

  } catch (err: unknown) {
    console.error('[/api/transcribe] Error:', err);
    const status = (err as { status?: number })?.status ?? 500;
    const rawMsg = (err as Error)?.message ?? '';

    let message = 'Transcription failed. Please try again.';
    if (status === 401 || status === 403) message = 'Invalid Groq API key. Check GROQ_API_KEY in .env.local.';
    else if (status === 404) message = 'Model not found: whisper-large-v3-turbo.';
    else if (status === 429) message = 'Groq rate limit reached. Please wait a moment and try again.';
    else if (rawMsg) message = rawMsg;

    return NextResponse.json({ error: message }, { status });
  }
}
