'use client';

import { useState, useRef, useEffect } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { transcribeAudio } from '@/lib/ai/transcribe';
import Waveform from '@/components/audio/Waveform';
import styles from './ConversationalInterface.module.css';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ConversationalInterfaceProps {
  scenarioName: string;
  scenarioPrompt: string;
  onEndInterview: (messages: Message[], totalDurationSeconds: number, totalWordCount: number) => void;
}

export default function ConversationalInterface({
  scenarioName,
  scenarioPrompt,
  onEndInterview,
}: ConversationalInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chatLogRef = useRef<HTMLDivElement>(null);
  
  const totalDurationRef = useRef(0);
  const totalWordCountRef = useRef(0);

  const recorder = useAudioRecorder();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages, isProcessing, aiSpeaking, recorder.recordingState]);

  // Initial kick-off
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initInterview = async () => {
      setIsProcessing(true);
      const initMessages: Message[] = [
        {
          role: 'system',
          content: `You are a hiring manager. The candidate is interviewing for a scenario: "${scenarioName}". The prompt context is: "${scenarioPrompt}". Start the interview by welcoming them and asking the first question. Keep it brief.`,
        },
      ];
      try {
        const res = await fetch('/api/interview/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: initMessages }),
        });
        if (!res.ok) throw new Error('Failed to start interview.');
        const data = await res.json();
        const reply = data.reply;
        setMessages([...initMessages, { role: 'assistant', content: reply }]);
        speakText(reply);
      } catch (err: unknown) {
        setErrorMsg((err as Error).message || 'Failed to connect.');
      } finally {
        setIsProcessing(false);
      }
    };

    initInterview();
  }, [scenarioName, scenarioPrompt]);

  // Handle recorded audio
  useEffect(() => {
    if (recorder.recordingState === 'stopped' && recorder.audioBlob) {
      handleUserTurn(recorder.audioBlob, recorder.durationSeconds);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.recordingState, recorder.audioBlob]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    try {
      setAiSpeaking(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: 'carly' }),
      });
      if (!res.ok) throw new Error('TTS Failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setAiSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setAiSpeaking(false);
        URL.revokeObjectURL(url);
      };

      await audio.play().catch((err) => {
        console.error('Playback prevented by browser', err);
        setAiSpeaking(false);
      });
    } catch (err) {
      console.error('TTS Error:', err);
      setAiSpeaking(false);
    }
  };

  const handleUserTurn = async (blob: Blob, duration: number) => {
    setIsProcessing(true);
    setErrorMsg(null);
    totalDurationRef.current += duration;

    try {
      // 1. Transcribe setup
      const { transcript, wordCount } = await transcribeAudio(blob, duration);
      totalWordCountRef.current += wordCount;

      if (!transcript.trim()) {
        throw new Error("We couldn't hear anything. Please try speaking again.");
      }

      const newHistory: Message[] = [...messages, { role: 'user', content: transcript }];
      setMessages(newHistory);

      // 2. Chat completion
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!res.ok) throw new Error('Network error chatting with AI.');
      const data = await res.json();
      const reply = data.reply;

      setMessages([...newHistory, { role: 'assistant', content: reply }]);
      speakText(reply);

    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Error processing response.');
    } finally {
      setIsProcessing(false);
      recorder.reset();
    }
  };

  const stopAiSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAiSpeaking(false);
  };

  const handleEndInterview = () => {
    stopAiSpeech();
    onEndInterview(messages, totalDurationRef.current, totalWordCountRef.current);
  };

  // Rendering helpers
  const isRecording = recorder.recordingState === 'recording';
  const disableControls = isProcessing || aiSpeaking;

  return (
    <div className={styles.container}>
      <div className={styles.chatLog} ref={chatLogRef}>
        {messages.filter(m => m.role !== 'system').map((msg, i) => (
          <div key={i} className={`${styles.message} ${styles['msg' + msg.role]}`}>
            <div className={styles.speakerName}>
              {msg.role === 'assistant' ? 'Interviewer' : 'You'}
            </div>
            {msg.content}
          </div>
        ))}
        {isRecording && (
          <div className={`${styles.message} ${styles.msgsystem} ${styles.pulsing}`}>
            Listening...
          </div>
        )}
        {isProcessing && (
          <div className={`${styles.message} ${styles.msgsystem} ${styles.pulsing}`}>
            Processing...
          </div>
        )}
        {aiSpeaking && (
          <div className={`${styles.message} ${styles.msgsystem} ${styles.pulsing}`}>
            Interviewer is speaking...
          </div>
        )}
        {messages.length === 1 && !isProcessing && (
          <div className={`${styles.message} ${styles.msgsystem}`}>
            Interview starting... Please wait.
          </div>
        )}
      </div>

      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      <div className={styles.controls}>
        <div className={styles.waveformWrap}>
           {isRecording ? (
             <Waveform analyserNode={recorder.analyserNode} isActive={true} />
           ) : (
             <div className={styles.statusText}>
               {aiSpeaking ? 'Listening to Interviewer...' : 'Ready when you are'}
             </div>
           )}
        </div>

        <div className={styles.buttons}>
          {aiSpeaking && (
            <button className={styles.btnSecondary} onClick={stopAiSpeech}>
              Stop AI Speech
            </button>
          )}

          {!isRecording ? (
            <button
              className={styles.btnPrimary}
              onClick={recorder.start}
              disabled={disableControls}
            >
              🎤 Start Speaking
            </button>
          ) : (
            <button
              className={`${styles.btnPrimary} ${styles.btnRecording}`}
              onClick={recorder.stop}
            >
              ⏹️ Done Speaking
            </button>
          )}
          
          <button className={styles.btnSecondary} onClick={handleEndInterview}>
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}
