'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import Waveform from '@/components/audio/Waveform';
import RecordingControls from '@/components/audio/RecordingControls';
import ScenarioCard from '@/components/scenarios/ScenarioCard';
import FeedbackPanel from '@/components/feedback/FeedbackPanel';
import { SCENARIOS, getRandomPrompt, type Scenario } from '@/lib/scenarios';
import { transcribeAudio } from '@/lib/ai/transcribe';
import { saveSession } from '@/lib/storage/sessions';
import type { FeedbackResult } from '@/lib/ai/feedback-schema';
import ConversationalInterface, { type Message } from '@/components/interview/ConversationalInterface';
import styles from './page.module.css';

type Stage = 'select' | 'record' | 'processing' | 'feedback';

interface ProcessingStep {
  label: string;
  done: boolean;
  active: boolean;
}

const INITIAL_STEPS: ProcessingStep[] = [
  { label: 'Transcribing your speech…',       done: false, active: false },
  { label: 'Analysing with AI…',              done: false, active: false },
  { label: 'Building your feedback report…',  done: false, active: false },
];

const STAGE_STEPS: { stage: Stage; label: string }[] = [
  { stage: 'select',     label: 'Choose scenario' },
  { stage: 'record',     label: 'Record' },
  { stage: 'processing', label: 'Analysing' },
  { stage: 'feedback',   label: 'Feedback' },
];

// ── Back arrow SVG ────────────────────────────────────────────────────────────
const BackArrow = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ShuffleIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
    <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
  </svg>
);


export default function PracticePage() {
  const router = useRouter();
  const recorder = useAudioRecorder();

  const [stage, setStage] = useState<Stage>('select');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [prompt, setPrompt] = useState('');
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [diceValue, setDiceValue] = useState<number | string>('🎲');
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [transcript, setTranscript] = useState('');
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ProcessingStep[]>(INITIAL_STEPS);

  const processingRef = useRef(false);

  const selectScenario = (s: Scenario) => {
    setScenario(s);
    setPrompt(s.id === 'impromptu' ? 'Select a challenge type below to generate your topic.' : getRandomPrompt(s));
    setTargetTime(null);
    setDiceValue('🎲');
    setIsDiceRolling(false);
    setIsGeneratingTopic(false);
    setStage('record');
    recorder.reset();
  };

  const rollDice = useCallback(() => {
    setIsDiceRolling(true);
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 12) {
        clearInterval(interval);
        setIsDiceRolling(false);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalVal);
        setTargetTime(finalVal);
      }
    }, 80);
  }, []);

  const startImpromptuChallenge = useCallback(async (type: 'one_word' | 'two_word' | 'one_sentence') => {
    setIsGeneratingTopic(true);
    setPrompt('Generating your topic with LLaMA-3.1-8B...');
    rollDice();

    try {
      const res = await fetch('/api/impromptu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        const data = await res.json();
        setPrompt(data.topic);
      } else {
        setPrompt("Fail to generate topic. Talk about artificial intelligence.");
      }
    } catch (e) {
      setPrompt("Fail to generate topic. Talk about your favorite hobby.");
    } finally {
      setIsGeneratingTopic(false);
    }
  }, [rollDice]);

  const markStep = useCallback((idx: number, done: boolean, active: boolean) => {
    setSteps((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, done, active } : i < idx ? { ...s, done: true, active: false } : s,
      ),
    );
  }, []);

  const processAudio = useCallback(
    async (blob: Blob, duration: number, currentScenario: Scenario, currentPrompt: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      setStage('processing');
      setProcessingError(null);
      setSteps([
        { label: 'Transcribing your speech…',       done: false, active: true },
        { label: 'Analysing with AI…',              done: false, active: false },
        { label: 'Building your feedback report…',  done: false, active: false },
      ]);

      try {
        const { transcript: tx, wordCount, durationSeconds } = await transcribeAudio(blob, duration);
        setTranscript(tx);
        markStep(0, true, false);
        markStep(1, false, true);

        const promptToSend = currentScenario.id === 'impromptu' && targetTime 
          ? `[Target speaking time: ${targetTime} minutes] ${currentPrompt}` 
          : currentPrompt;

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: tx,
            scenarioName: currentScenario.name,
            scenarioPrompt: promptToSend,
            durationSeconds,
            wordCount,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
          throw new Error(err.error ?? `API error ${res.status}`);
        }

        const { feedback: fb } = await res.json() as { feedback: FeedbackResult };
        markStep(1, true, false);
        markStep(2, false, true);

        saveSession({
          id: crypto.randomUUID(),
          scenarioId: currentScenario.id,
          scenarioName: currentScenario.name,
          prompt: promptToSend,
          transcript: tx,
          durationSeconds,
          wordCount,
          feedback: fb,
          createdAt: new Date().toISOString(),
        });

        setFeedback(fb);
        markStep(2, true, false);
        setTimeout(() => setStage('feedback'), 400);
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? 'Something went wrong. Please try again.';
        setProcessingError(msg);
        setStage('record');
      } finally {
        processingRef.current = false;
      }
    },
    [markStep],
  );

  const processConversationalAudio = useCallback(
    async (messages: Message[], duration: number, wordCount: number, currentScenario: Scenario, currentPrompt: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      setStage('processing');
      setProcessingError(null);
      setSteps([
        { label: 'Summarising transcript…',       done: true, active: false },
        { label: 'Analysing with AI…',              done: false, active: true },
        { label: 'Building your feedback report…',  done: false, active: false },
      ]);

      try {
        const res = await fetch('/api/interview/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             messages,
             scenarioName: currentScenario.name,
             durationSeconds: duration,
             wordCount: wordCount,
          }),
        });
        
        if (!res.ok) {
           const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
           throw new Error(err.error ?? `API error ${res.status}`);
        }
        
        const data = await res.json() as { feedback: FeedbackResult, transcript: string };
        const fb = data.feedback;
        const tx = data.transcript;

        markStep(1, true, false);
        markStep(2, false, true);

        saveSession({
          id: crypto.randomUUID(),
          scenarioId: currentScenario.id,
          scenarioName: `${currentScenario.name} (Conversational)`,
          prompt: currentPrompt,
          transcript: tx,
          durationSeconds: duration,
          wordCount,
          feedback: fb,
          createdAt: new Date().toISOString(),
        });

        setTranscript(tx);
        setFeedback(fb);
        markStep(2, true, false);
        setTimeout(() => setStage('feedback'), 400);

      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? 'Something went wrong. Please try again.';
        setProcessingError(msg);
        setStage('record');
      } finally {
        processingRef.current = false;
      }
    },
    [markStep]
  );

  useEffect(() => {
    if (recorder.recordingState === 'stopped' && recorder.audioBlob && stage === 'record' && scenario && scenario.type !== 'conversational') {
      processAudio(recorder.audioBlob, recorder.durationSeconds, scenario, prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.recordingState, recorder.audioBlob]);

  const restart = () => {
    recorder.reset();
    setFeedback(null);
    setTranscript('');
    setProcessingError(null);
    setSteps(INITIAL_STEPS);
    setTargetTime(null);
    setDiceValue('🎲');
    setIsDiceRolling(false);
    setIsGeneratingTopic(false);
    processingRef.current = false;
    setStage('select');
  };

  const tryAgain = () => {
    recorder.reset();
    setFeedback(null);
    setTranscript('');
    setProcessingError(null);
    setSteps(INITIAL_STEPS);
    if (scenario?.id !== 'impromptu') {
      setTargetTime(null);
    }
    setIsGeneratingTopic(false);
    processingRef.current = false;
    setStage('record');
  };

  const stageIndex = STAGE_STEPS.findIndex(s => s.stage === stage);

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <button className={styles.backBtn} aria-label="Back to dashboard" onClick={() => router.push('/')}>
            <BackArrow /> <span className={styles.backBtnText}>Dashboard</span>
          </button>
          
          <div className={styles.titleArea}>
            <h1 className={styles.title}>
              <span className={styles.desktopTitle}>Practice</span>
              <span className={styles.mobileTitle}>
                {stage === 'select' && 'Choose Scenario'}
                {stage === 'record' && (scenario?.name ?? 'Practice')}
                {stage === 'processing' && 'Analysing…'}
                {stage === 'feedback' && 'Your Feedback'}
              </span>
            </h1>
            {scenario && (
              <p className={styles.scenarioName}>
                {scenario.icon} {scenario.name}
              </p>
            )}
          </div>

          {stage !== 'select' ? (
            <button className={styles.restartBtnMobile} aria-label="Restart practice session" onClick={restart}>Reset</button>
          ) : (
            <div className={styles.restartGhostMobile} />
          )}
        </header>

        <div className={styles.stagesContainer}>
          <div className={styles.desktopStages}>
            {STAGE_STEPS.map(({ stage: s, label }, i) => {
              const done = i < stageIndex;
              const active = i === stageIndex;
              return (
                <div key={s} className={`${styles.stageItem} ${done ? styles.done : ''} ${active ? styles.active : ''}`}>
                  <div className={styles.stageDot}>
                    {done ? (
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <span className={styles.stageNum}>{i + 1}</span>
                    )}
                  </div>
                  <span className={styles.stageLabel}>{label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.mobileStages}>
            {STAGE_STEPS.map(({ stage: s }, i) => (
              <div
                key={s}
                className={`${styles.mobStagePip} ${i < stageIndex ? styles.done : ''} ${i === stageIndex ? styles.active : ''}`}
              />
            ))}
          </div>
        </div>

        {stage === 'record' && scenario?.type !== 'conversational' && (
          <div className={styles.tipsContainer}>
            <p className={styles.tipsHeading}>Tips</p>
            {[
              'Speak at a natural pace (130–150 wpm)',
              'Pause instead of "um" or "uh"',
              'Clear opening, body, conclusion',
            ].map(tip => (
              <p key={tip} className={styles.tip}>{tip}</p>
            ))}
          </div>
        )}
        {stage === 'record' && scenario?.type === 'conversational' && (
          <div className={styles.tipsContainer}>
            <p className={styles.tipsHeading}>Conversational Tips</p>
            {[
              'Listen carefully to the AI interviewer',
              'Hold space (or click Start) to reply',
              'Speak clearly and hit Stop when done',
              'End the interview to get feedback',
            ].map(tip => (
              <p key={tip} className={styles.tip}>{tip}</p>
            ))}
          </div>
        )}
      </aside>

      <main className={styles.main}>
        {stage === 'select' && (
          <div className={styles.contentWrap}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Choose a scenario</h2>
              <p className={styles.sectionSub}>Pick a practice context. You'll receive AI feedback on 6 speech dimensions.</p>
            </div>
            <div className={styles.scenarioList}>
              {SCENARIOS.map((s) => (
                <ScenarioCard key={s.id} scenario={s} onSelect={selectScenario} />
              ))}
            </div>
          </div>
        )}

        {stage === 'record' && scenario && (
          <div className={styles.contentWrap}>
            {scenario.type === 'conversational' ? (
              <ConversationalInterface 
                scenarioName={scenario.name}
                scenarioPrompt={prompt}
                onEndInterview={(messages, duration, wordCount) => processConversationalAudio(messages, duration, wordCount, scenario, prompt)}
              />
            ) : (
              <>
                <div className={styles.promptCard}>
                  <div className={styles.promptHeaderRow}>
                    <span className={styles.promptEyebrow}>Your prompt</span>
                    {scenario.id === 'impromptu' && targetTime && !isGeneratingTopic && (
                      <span className={styles.targetTimeBadge}>🎯 Target: {targetTime} min{targetTime > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <p className={styles.promptText}>{prompt.startsWith('Select') || prompt.startsWith('Generating') ? prompt : `"${prompt}"`}</p>
                  
                  {scenario.id !== 'impromptu' && (
                    <button
                      className={styles.shuffleBtn}
                      onClick={() => setPrompt(getRandomPrompt(scenario))}
                      disabled={recorder.recordingState !== 'idle' && recorder.recordingState !== 'error'}
                    >
                      <ShuffleIcon /> Different prompt
                    </button>
                  )}
                </div>

                {scenario.id === 'impromptu' && (targetTime === null || isGeneratingTopic) ? (
                  <div className={styles.diceBlock}>
                    {(!isDiceRolling && !isGeneratingTopic && targetTime === null) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', width: '100%' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-1)'}}>Choose your challenge:</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button className={`${styles.actionBtn} ${styles.btnOutline}`} onClick={() => startImpromptuChallenge('one_word')} style={{ flex: '1 1 120px' }}>One Word</button>
                          <button className={`${styles.actionBtn} ${styles.btnOutline}`} onClick={() => startImpromptuChallenge('two_word')} style={{ flex: '1 1 120px' }}>Two Words</button>
                          <button className={`${styles.actionBtn} ${styles.btnOutline}`} onClick={() => startImpromptuChallenge('one_sentence')} style={{ flex: '1 1 150px' }}>One Sentence</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`${styles.diceVisual} ${isDiceRolling ? styles.rolling : ''}`}>
                          {diceValue}
                        </div>
                        <p className={styles.diceText}>
                          {isGeneratingTopic ? "Generating your topic and rolling the dice..." : "Rolling the dice to determine your speaking time..."}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className={styles.waveformWrap}>
                      <Waveform
                        analyserNode={recorder.analyserNode}
                        isActive={recorder.recordingState === 'recording'}
                      />
                    </div>

                    {processingError && (
                      <div className={styles.errorAlert} role="alert">{processingError}</div>
                    )}

                    <RecordingControls
                      state={recorder.recordingState}
                      durationSeconds={recorder.durationSeconds}
                      onStart={recorder.start}
                      onStop={recorder.stop}
                      onPause={recorder.pause}
                      onResume={recorder.resume}
                      onReset={recorder.reset}
                      error={recorder.error}
                    />

                    <div className={styles.mobileTips}>
                      {[
                        'Speak at a natural pace (130–150 wpm)',
                        'Pause instead of "uh"',
                        'Clear opening & conclusion',
                      ].map(t => (
                        <p key={t} className={styles.mobileTip}>{t}</p>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {stage === 'processing' && (
          <div className={styles.processingWrap}>
            <div className={styles.processingInner}>
              <div className={styles.processingPulse} />
              <h2 className={styles.processingTitle}>Analysing your speech</h2>
              <p className={styles.processingSub}>Groq Whisper + Llama-3.1-8B</p>
              <div className={styles.steps}>
                {steps.map((step, i) => (
                  <div key={i} className={`${styles.step} ${step.done ? styles.stepDone : ''} ${step.active ? styles.stepActive : ''}`}>
                    <span className={styles.stepIcon}>
                      {step.done ? (
                         <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                           <polyline points="20 6 9 17 4 12"/>
                         </svg>
                      ) : step.active ? (
                        <span className={styles.spinner} />
                      ) : (
                        <span className={styles.stepNum}>{i + 1}</span>
                      )}
                    </span>
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === 'feedback' && feedback && (
          <div className={styles.contentWrap}>
            <FeedbackPanel feedback={feedback} transcript={transcript} />
            <div className={styles.feedbackActions}>
              <button className={`${styles.actionBtn} ${styles.btnPrimary}`} onClick={tryAgain}>
                Practice again
              </button>
              <button className={`${styles.actionBtn} ${styles.btnOutline}`} onClick={restart}>
                Different scenario
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
