import { NextRequest, NextResponse } from 'next/server';
import { SpeechifyClient } from '@speechify/api';

export const maxDuration = 60; // Allow sufficient time for generation

export async function POST(req: NextRequest) {
  const apiKey = process.env.SPEECHIFY_API_KEY;
  if (!apiKey || apiKey === 'your-api-key-here') {
    return NextResponse.json(
      { error: 'SPEECHIFY_API_KEY is not configured.' },
      { status: 503 },
    );
  }

  try {
    const { text, voiceId = 'carly' } = await req.json() as { text: string; voiceId?: string };

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is empty.' }, { status: 400 });
    }

    const client = new SpeechifyClient({ token: apiKey });
    
    // Convert text to Speechify Audio
    const response = await client.tts.audio.speech({
      input: text,
      voiceId: voiceId,
      audioFormat: "mp3",
    });

    // We can either return the Base64 audio directly, or return it wrapped in JSON.
    // Let's proxy the raw MP3 bytes out directly so the frontend can easily read as a blob!
    const audioBuffer = Buffer.from(response.audioData, 'base64');

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });

  } catch (err: unknown) {
    console.error('[/api/tts] Error generating speech:', err);
    return NextResponse.json(
      { error: 'TTS Generation failed.' },
      { status: 500 }
    );
  }
}
