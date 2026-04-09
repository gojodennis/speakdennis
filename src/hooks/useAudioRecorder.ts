'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type RecordingState = 'idle' | 'requesting' | 'recording' | 'paused' | 'stopped' | 'error';

export interface AudioRecorderState {
  recordingState: RecordingState;
  durationSeconds: number;
  audioBlob: Blob | null;
  error: string | null;
  analyserNode: AnalyserNode | null;
}

export interface AudioRecorderActions {
  start: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

const MAX_DURATION_SECONDS = 300; // 5 minutes
const MIN_DURATION_SECONDS = 10;

export function useAudioRecorder(): AudioRecorderState & AudioRecorderActions {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    streamRef.current = null;
    audioContextRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now() - pausedDurationRef.current * 1000;
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDurationSeconds(elapsed);
      if (elapsed >= MAX_DURATION_SECONDS) {
        mediaRecorderRef.current?.stop();
      }
    }, 500);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setRecordingState('requesting');
    chunksRef.current = [];
    pausedDurationRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      streamRef.current = stream;

      // Set up Web Audio analyser for waveform visualisation
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      setAnalyserNode(analyser);

      // Pick best supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setRecordingState('stopped');
        cleanup();
      };

      recorder.onerror = () => {
        setError('Recording error. Please try again.');
        setRecordingState('error');
        cleanup();
      };

      recorder.start(1000); // collect data every second
      setRecordingState('recording');
      startTimer();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied.';
      if (msg.includes('Permission denied') || msg.includes('NotAllowed')) {
        setError('Microphone permission denied. Please allow access and try again.');
      } else {
        setError(msg);
      }
      setRecordingState('error');
      cleanup();
    }
  }, [cleanup, startTimer]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (durationSeconds < MIN_DURATION_SECONDS) {
      setError(`Please record for at least ${MIN_DURATION_SECONDS} seconds.`);
      mediaRecorderRef.current?.stop();
      return;
    }
    mediaRecorderRef.current?.stop();
  }, [durationSeconds]);

  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      pausedDurationRef.current = durationSeconds;
      setRecordingState('paused');
    }
  }, [durationSeconds]);

  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      startTimer();
      setRecordingState('recording');
    }
  }, [startTimer]);

  const reset = useCallback(() => {
    cleanup();
    setRecordingState('idle');
    setDurationSeconds(0);
    setAudioBlob(null);
    setError(null);
    setAnalyserNode(null);
    chunksRef.current = [];
    pausedDurationRef.current = 0;
  }, [cleanup]);

  return {
    recordingState,
    durationSeconds,
    audioBlob,
    error,
    analyserNode,
    start,
    stop,
    pause,
    resume,
    reset,
  };
}
