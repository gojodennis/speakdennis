export interface TranscribeResult {
  transcript: string;
  wordCount: number;
  durationSeconds: number;
  wordsPerMinute: number;
}

/**
 * Send a recorded audio blob to the /api/transcribe route,
 * which proxies to NVIDIA NIM Canary-Qwen-2.5B.
 */
export async function transcribeAudio(
  audioBlob: Blob,
  durationSeconds: number,
): Promise<TranscribeResult> {
  const formData = new FormData();
  // Convert to wav if not already — server will handle webm/opus too
  const ext = audioBlob.type.includes('webm') ? 'webm' : 'wav';
  formData.append('audio', audioBlob, `recording.${ext}`);
  formData.append('duration', String(durationSeconds));

  const res = await fetch('/api/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? `Transcription failed: ${res.status}`);
  }

  const data = await res.json() as { transcript: string };
  const transcript = data.transcript?.trim() ?? '';
  const wordCount = transcript ? transcript.split(/\s+/).filter(Boolean).length : 0;
  const wordsPerMinute = durationSeconds > 0
    ? Math.round((wordCount / durationSeconds) * 60)
    : 0;

  return { transcript, wordCount, durationSeconds, wordsPerMinute };
}
