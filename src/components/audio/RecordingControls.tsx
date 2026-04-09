'use client';

import type { RecordingState } from '@/hooks/useAudioRecorder';

interface RecordingControlsProps {
  state: RecordingState;
  durationSeconds: number;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  error: string | null;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function RecordingControls({
  state, durationSeconds, onStart, onStop, onPause, onResume, onReset, error,
}: RecordingControlsProps) {
  const isRecording = state === 'recording';
  const isPaused = state === 'paused';
  const isIdle = state === 'idle' || state === 'error';
  const isStopped = state === 'stopped';
  const isRequesting = state === 'requesting';

  return (
    <div className="recording-controls">
      {/* Timer */}
      <div className="timer-display" aria-live="polite" aria-label={`Recording time: ${formatTime(durationSeconds)}`}>
        <span className={`timer-value ${isRecording ? 'timer-active' : ''}`}>
          {formatTime(durationSeconds)}
        </span>
        {isRecording && <span className="rec-dot" aria-hidden="true" />}
        {isPaused && <span className="paused-label">PAUSED</span>}
      </div>

      {/* Controls */}
      <div className="controls-row">
        {isIdle && (
          <button id="btn-start-recording" className="btn btn-primary btn-record" onClick={onStart}>
            <span>🎙️</span> Start Speaking
          </button>
        )}

        {isRequesting && (
          <button className="btn btn-outline" disabled>
            <span className="spinner" /> Requesting mic…
          </button>
        )}

        {(isRecording || isPaused) && (
          <>
            <button
              id="btn-pause-resume"
              className="btn btn-outline"
              onClick={isPaused ? onResume : onPause}
              aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              id="btn-stop-recording"
              className="btn btn-danger"
              onClick={onStop}
              aria-label="Stop recording and analyse"
            >
              ⏹ Stop &amp; Analyse
            </button>
          </>
        )}

        {isStopped && (
          <button id="btn-record-again" className="btn btn-outline" onClick={onReset}>
            🔄 Record Again
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="recording-error" role="alert">{error}</p>
      )}

      {/* Min duration hint */}
      {isIdle && (
        <p className="recording-hint">Speak for at least 10 seconds · Max 5 minutes</p>
      )}

      <style>{`
        .recording-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 8px 0;
        }
        .timer-display {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .timer-value {
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 800;
          color: rgba(46,31,39,0.25);
          letter-spacing: 0.05em;
          transition: color 200ms;
          font-variant-numeric: tabular-nums;
        }
        .timer-active { color: #2e1f27; }
        .rec-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #dd7230;
          animation: rec-pulse 1.2s ease-in-out infinite;
        }
        @keyframes rec-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        .paused-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #854d27;
          text-transform: uppercase;
        }
        .controls-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        /* Shared button base */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 160ms ease;
          white-space: nowrap;
        }
        .btn-primary, .btn-record {
          background: #dd7230;
          color: #fff;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-outline {
          background: transparent;
          border: 1.5px solid rgba(46,31,39,0.15) !important;
          color: rgba(46,31,39,0.65);
        }
        .btn-outline:hover { border-color: #dd7230 !important; color: #dd7230; }
        .btn-danger {
          background: #2e1f27;
          color: #fff;
        }
        .btn-danger:hover { opacity: 0.85; }
        .btn-ghost {
          background: transparent;
          color: rgba(46,31,39,0.5);
          padding: 10px 16px;
        }
        .btn-ghost:hover { color: #2e1f27; }
        .recording-error {
          color: #854d27;
          font-size: 0.875rem;
          text-align: center;
          max-width: 40ch;
          background: rgba(221,114,48,0.08);
          border-radius: 10px;
          padding: 10px 16px;
        }
        .recording-hint {
          font-size: 0.8125rem;
          color: rgba(46,31,39,0.4);
          text-align: center;
        }
        .spinner {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(46,31,39,0.15);
          border-top-color: #dd7230;
          animation: spin-ctrl 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin-ctrl { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
