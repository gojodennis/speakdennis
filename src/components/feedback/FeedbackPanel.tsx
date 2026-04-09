'use client';

import { useState } from 'react';
import type { FeedbackResult, PronunciationAnalysis } from '@/lib/ai/feedback-schema';
import { scoreLabel } from '@/lib/ai/feedback-schema';
import ScoreGauge from './ScoreGauge';

type PronunciationFlag = PronunciationAnalysis['flags'][number];


interface FeedbackPanelProps {
  feedback: FeedbackResult;
  transcript: string;
}

type TabId = 'overview' | 'pace' | 'fillers' | 'grammar' | 'pronunciation' | 'vocabulary' | 'structure';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  score: number;
}

export default function FeedbackPanel({ feedback, transcript }: FeedbackPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: Tab[] = [
    { id: 'overview',      label: 'Overview',      icon: '📊', score: feedback.overall.score },
    { id: 'pace',          label: 'Pace',           icon: '⏱️',  score: feedback.pace.score },
    { id: 'fillers',       label: 'Fillers',        icon: '🗣️',  score: feedback.filler_words.score },
    { id: 'grammar',       label: 'Grammar',        icon: '✍️',  score: feedback.grammar.score },
    { id: 'pronunciation', label: 'Pronunciation',  icon: '🔊',  score: feedback.pronunciation.score },
    { id: 'vocabulary',    label: 'Vocabulary',     icon: '📚',  score: feedback.vocabulary.score },
    { id: 'structure',     label: 'Structure',      icon: '🏗️',  score: feedback.structure.score },
  ];

  function scoreColor(s: number) {
    if (s >= 85) return '#2e7d32';
    if (s >= 65) return '#dd7230';
    if (s >= 45) return '#854d27';
    return '#b71c1c';
  }

  return (
    <div className="feedback-panel animate-fade-up">
      {/* Tab nav */}
      <div className="tab-nav" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`tab-btn ${activeTab === t.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
            {t.id !== 'overview' && (
              <span className="tab-score" style={{ color: scoreColor(t.score) }}>
                {t.score}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content glass-card" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>

        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="gauge-row">
              <ScoreGauge score={feedback.overall.score} label={feedback.overall.label} size={160} />
              <div className="summary-box">
                <p className="summary-text">{feedback.overall.summary}</p>
                <div className="str-imp-grid">
                  <div>
                    <h4 className="str-heading">💪 Strengths</h4>
                    <ul className="str-list">
                      {feedback.overall.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="str-heading" style={{ color: 'var(--color-accent)' }}>🎯 Improve</h4>
                    <ul className="str-list imp-list">
                      {feedback.overall.improvements.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Score grid */}
            <div className="score-grid">
              {tabs.filter(t => t.id !== 'overview').map((t) => (
                <button
                  key={t.id}
                  className="score-tile"
                  onClick={() => setActiveTab(t.id)}
                  aria-label={`View ${t.label} feedback, score ${t.score}`}
                >
                  <span className="score-tile-icon">{t.icon}</span>
                  <span className="score-tile-label">{t.label}</span>
                  <span className="score-tile-value" style={{ color: scoreColor(t.score) }}>{t.score}</span>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${t.score}%`, background: scoreColor(t.score) }} />
                  </div>
                </button>
              ))}
            </div>

            <div className="divider" />
            <div className="transcript-box">
              <h4 className="transcript-label">📝 Your Transcript</h4>
              {(() => {
                if (!transcript) return <p className="transcript-text">No transcript available.</p>;

                // Detect if conversational
                const isConversational = transcript.includes('Interviewer:') || transcript.includes('Candidate:');
                if (!isConversational) {
                  return <p className="transcript-text">{transcript}</p>;
                }

                // Parse into chat messages
                const bubbles = transcript.split('\n\n').filter(Boolean).map((segment, i) => {
                  let role = 'system';
                  let text = segment;
                  if (segment.startsWith('Interviewer:')) {
                    role = 'interviewer';
                    text = segment.replace(/^Interviewer:\s*/, '');
                  } else if (segment.startsWith('Candidate:')) {
                    role = 'candidate';
                    text = segment.replace(/^Candidate:\s*/, '');
                  }
                  return { role, text, id: i };
                });

                return (
                  <div className="chat-transcript-log">
                    {bubbles.map(b => (
                      <div key={b.id} className={`chat-bubble-row ${b.role === 'candidate' ? 'chat-right' : 'chat-left'}`}>
                        <div className={`chat-bubble ${b.role === 'candidate' ? 'chat-bubble-candidate' : 'chat-bubble-interviewer'}`}>
                          <span className="chat-speaker">{b.role === 'candidate' ? 'You' : 'Interviewer'}</span>
                          <span className="chat-text">{b.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === 'pace' && (
          <DimensionTab
            score={feedback.pace.score}
            label={scoreLabel(feedback.pace.score)}
            advice={feedback.pace.advice}
            icon="⏱️"
            title="Pace & Speed"
          >
            <div className="stat-row">
              <StatChip label="Words/min" value={String(feedback.pace.wpm)} />
              <StatChip label="Assessment" value={feedback.pace.assessment.replace('_', ' ')} />
            </div>
          </DimensionTab>
        )}

        {activeTab === 'fillers' && (
          <DimensionTab
            score={feedback.filler_words.score}
            label={scoreLabel(feedback.filler_words.score)}
            advice={feedback.filler_words.advice}
            icon="🗣️"
            title="Filler Words"
          >
            <div className="stat-row">
              <StatChip label="Total fillers" value={String(feedback.filler_words.total_count)} />
              <StatChip label="% of words" value={`${feedback.filler_words.percentage.toFixed(1)}%`} />
            </div>
            {feedback.filler_words.fillers.length > 0 && (
              <div className="filler-chips">
                {feedback.filler_words.fillers.map((f, i) => (
                  <span key={i} className="filler-chip">
                    "{f.word}" <strong>×{f.count}</strong>
                  </span>
                ))}
              </div>
            )}
          </DimensionTab>
        )}

        {activeTab === 'grammar' && (
          <DimensionTab
            score={feedback.grammar.score}
            label={scoreLabel(feedback.grammar.score)}
            advice={feedback.grammar.advice}
            icon="✍️"
            title="Grammar"
          >
            {feedback.grammar.issues.length === 0 ? (
              <p className="no-issues">✅ No grammar issues detected!</p>
            ) : (
              <ul className="issue-list">
                {feedback.grammar.issues.map((issue, i) => (
                  <li key={i} className="issue-item">
                    <span className="issue-original">"{issue.original}"</span>
                    <span className="issue-arrow">→</span>
                    <span className="issue-fix">"{issue.correction}"</span>
                    {issue.rule && <span className="issue-rule">{issue.rule}</span>}
                  </li>
                ))}
              </ul>
            )}
          </DimensionTab>
        )}

        {activeTab === 'pronunciation' && (
          <DimensionTab
            score={feedback.pronunciation.score}
            label={scoreLabel(feedback.pronunciation.score)}
            advice={feedback.pronunciation.advice}
            icon="🔊"
            title="Pronunciation"
          >
            {feedback.pronunciation.flags.length === 0 ? (
              <p className="no-issues">✅ No pronunciation issues detected!</p>
            ) : (
              <PronunciationTranscript
                transcript={transcript}
                flags={feedback.pronunciation.flags}
              />
            )}
          </DimensionTab>
        )}

        {activeTab === 'vocabulary' && (
          <DimensionTab
            score={feedback.vocabulary.score}
            label={scoreLabel(feedback.vocabulary.score)}
            advice={feedback.vocabulary.advice}
            icon="📚"
            title="Vocabulary"
          >
            <StatChip label="Level" value={feedback.vocabulary.level} />
            {feedback.vocabulary.suggestions.length > 0 && (
              <ul className="suggestion-list">
                {feedback.vocabulary.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </DimensionTab>
        )}

        {activeTab === 'structure' && (
          <DimensionTab
            score={feedback.structure.score}
            label={scoreLabel(feedback.structure.score)}
            advice={feedback.structure.advice}
            icon="🏗️"
            title="Structure"
          >
            <div className="stat-row">
              <StatChip label="Coherence" value={`${feedback.structure.coherence}/100`} />
              <StatChip label="Opening" value={feedback.structure.has_opening ? '✅ Yes' : '❌ Missing'} />
              <StatChip label="Conclusion" value={feedback.structure.has_conclusion ? '✅ Yes' : '❌ Missing'} />
            </div>
          </DimensionTab>
        )}
      </div>

      <style>{`
        .feedback-panel { display: flex; flex-direction: column; gap: 16px; }

        /* Tab nav */
        .tab-nav {
          display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;
          scrollbar-width: none;
        }
        .tab-nav::-webkit-scrollbar { display: none; }
        .tab-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          background: #fff; border: 1px solid rgba(46,31,39,0.08);
          border-radius: 99px; cursor: pointer; color: rgba(46,31,39,0.45);
          font-size: 0.8125rem; font-weight: 500; white-space: nowrap;
          transition: all 160ms ease;
        }
        .tab-btn:hover { border-color: #dd7230; color: #dd7230; }
        .tab-active {
          background: #2e1f27; border-color: #2e1f27;
          color: #fff;
        }
        .tab-icon { font-size: 0.875rem; }
        .tab-score { font-weight: 700; font-size: 0.75rem; }

        /* Tab content */
        .tab-content {
          background: #fff;
          border: 1px solid rgba(46,31,39,0.06);
          border-radius: 16px;
          padding: 24px;
        }

        /* Overview */
        .overview-tab { display: flex; flex-direction: column; gap: 24px; }
        .gauge-row { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
        .summary-box { flex: 1; min-width: 200px; }
        .summary-text { color: rgba(46,31,39,0.6); margin-bottom: 16px; max-width: 50ch; font-size: 0.9375rem; line-height: 1.6; }
        .str-imp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .str-heading { font-size: 0.8125rem; font-weight: 700; margin-bottom: 8px; color: #2e7d32; }
        .str-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
        .str-list li { font-size: 0.875rem; color: rgba(46,31,39,0.6); padding-left: 12px; position: relative; }
        .str-list li::before { content: '·'; position: absolute; left: 0; color: #dd7230; }
        .imp-list .str-heading { color: #854d27; }
        .imp-list li::before { color: #854d27; }

        /* Score grid */
        .score-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;
        }
        .score-tile {
          display: flex; flex-direction: column; gap: 4px;
          padding: 16px; background: #f5f2eb;
          border: 1px solid rgba(46,31,39,0.06); border-radius: 12px;
          cursor: pointer; text-align: left; transition: all 160ms ease;
          color: inherit;
        }
        .score-tile:hover { border-color: #dd7230; background: rgba(221,114,48,0.05); }
        .score-tile-icon { font-size: 1rem; }
        .score-tile-label { font-size: 0.75rem; color: rgba(46,31,39,0.45); }
        .score-tile-value { font-size: 1.375rem; font-weight: 800; }
        .score-bar-track { height: 3px; background: rgba(46,31,39,0.08); border-radius: 99px; margin-top: 4px; }
        .score-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }

        /* Transcript */
        .transcript-box { }
        .transcript-label { font-size: 0.875rem; font-weight: 600; margin-bottom: 12px; color: rgba(46,31,39,0.5); }
        .transcript-text {
          font-size: 0.9375rem; line-height: 1.8; color: rgba(46,31,39,0.65);
          background: #f5f2eb; padding: 16px 18px;
          border-radius: 12px; border-left: 3px solid #dd7230;
          max-width: none;
        }

        /* Conversational Transcript */
        .chat-transcript-log { display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto; padding-right: 8px; }
        .chat-bubble-row { display: flex; width: 100%; }
        .chat-left { justify-content: flex-start; }
        .chat-right { justify-content: flex-end; }
        .chat-bubble {
          max-width: 80%; padding: 14px 18px; border-radius: 16px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .chat-bubble-candidate {
          background: rgba(221,114,48,0.1); border: 1px solid rgba(221,114,48,0.2);
          border-bottom-right-radius: 4px;
        }
        .chat-bubble-interviewer {
          background: #f5f2eb; border: 1px solid rgba(46,31,39,0.06);
          border-bottom-left-radius: 4px;
        }
        .chat-speaker { font-size: 0.75rem; font-weight: 700; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.05em; }
        .chat-bubble-candidate .chat-speaker { color: #854d27; }
        .chat-bubble-interviewer .chat-speaker { color: #2e1f27; }
        .chat-text { font-size: 0.9375rem; line-height: 1.6; color: #2e1f27; }

        /* Dimension tabs */
        .dimension-tab { display: flex; flex-direction: column; gap: 20px; }
        .dimension-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .dimension-title-row { display: flex; align-items: center; gap: 12px; }
        .dim-icon { font-size: 1.375rem; }
        .dim-title { font-size: 1.0625rem; font-weight: 700; color: #2e1f27; }
        .dim-score { font-size: 2rem; font-weight: 900; color: #2e1f27; }
        .dim-label { font-size: 0.75rem; color: rgba(46,31,39,0.4); margin-top: -4px; }
        .advice-box {
          background: rgba(221,114,48,0.06); border: 1px solid rgba(221,114,48,0.15);
          border-radius: 12px; padding: 16px;
          font-size: 0.9375rem; color: rgba(46,31,39,0.65); max-width: none; line-height: 1.6;
        }
        .stat-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .stat-chip {
          padding: 10px 16px; background: #f5f2eb;
          border: 1px solid rgba(46,31,39,0.06); border-radius: 10px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .stat-chip-label { font-size: 0.6875rem; color: rgba(46,31,39,0.4); text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-chip-value { font-size: 0.9375rem; font-weight: 600; color: #2e1f27; }
        .no-issues { color: #2e7d32; font-size: 0.9375rem; max-width: none; }
        .issue-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .issue-item { display: flex; align-items: flex-start; gap: 8px; flex-wrap: wrap; font-size: 0.9rem; width: 100%; }
        
        /* Pronunciation inline transcript */
        .pron-section { display: flex; flex-direction: column; gap: 20px; }
        .pron-transcript-box {
          background: #f5f2eb;
          border: 1px solid rgba(46,31,39,0.06);
          border-radius: 12px;
          padding: 20px 24px;
          font-size: 1rem; line-height: 2;
          color: rgba(46,31,39,0.65);
          text-align: left;
          position: relative;
        }
        .pron-word { white-space: nowrap; display: inline; }
        .pron-flagged {
          display: inline;
          color: #854d27;
          font-weight: 600;
          border: 1.5px solid rgba(133,77,39,0.4);
          border-radius: 5px;
          padding: 1px 6px;
          margin: 0 1px;
          cursor: pointer;
          transition: background 160ms, border-color 160ms;
          background: rgba(221,114,48,0.1);
        }
        .pron-flagged:hover, .pron-flagged.pron-active {
          background: rgba(221,114,48,0.2);
          border-color: #dd7230;
        }
        .pron-detail-panel {
          background: #fff;
          border: 1px solid rgba(221,114,48,0.2);
          border-radius: 12px;
          padding: 16px 18px;
          display: flex; flex-direction: column; gap: 8px;
          animation: fadeSlideIn 0.2s ease;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pron-detail-word {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .pron-detail-flagged-word {
          font-size: 1.0625rem; font-weight: 700; color: #854d27;
          border: 1.5px solid rgba(133,77,39,0.3); border-radius: 6px;
          padding: 2px 10px; background: rgba(221,114,48,0.08);
        }
        .pron-detail-phonetic {
          font-family: monospace; font-size: 0.875rem;
          color: #dd7230; background: rgba(221,114,48,0.08);
          padding: 2px 8px; border-radius: 6px;
        }
        .pron-detail-issue { font-size: 0.875rem; color: rgba(46,31,39,0.5); }
        .pron-detail-suggestion { font-size: 0.875rem; color: #2e7d32; }
        .pron-flag-list { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
        .pron-flag-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 14px;
          background: #f5f2eb;
          border-left: 2px solid #dd7230;
          border-radius: 10px;
          cursor: pointer; transition: background 150ms;
        }
        .pron-flag-row:hover { background: rgba(221,114,48,0.08); }
        .pron-flag-word-badge {
          font-weight: 700; color: #854d27;
          border: 1.5px solid rgba(133,77,39,0.3);
          border-radius: 5px; padding: 1px 8px; flex-shrink: 0;
          background: rgba(221,114,48,0.1); font-size: 0.875rem;
        }
        .pron-flag-info { display: flex; flex-direction: column; gap: 3px; }
        .pron-flag-phonetic { font-family: monospace; font-size: 0.75rem; color: #dd7230; }
        .pron-flag-issue-text { font-size: 0.75rem; color: rgba(46,31,39,0.45); }
        .pron-flag-suggestion { font-size: 0.75rem; color: #2e7d32; }
        .pron-correct-btn {
          display: flex; align-items: center; justify-content: center;
          background: #dd7230;
          color: #fff; font-weight: 700; font-size: 0.9375rem;
          border: none; border-radius: 12px;
          padding: 14px 28px;
          cursor: pointer; transition: opacity 150ms, transform 120ms;
          margin-top: 4px;
        }
        .pron-correct-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        /* Pronunciation card (legacy) */
        .pronunciation-card { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; background: #f5f2eb; border-left: 2px solid #dd7230; border-radius: 10px; width: 100%; }
        .pronunciation-word-group { display: flex; align-items: baseline; gap: 8px; margin-bottom: 2px; }
        .phonetic-breakdown { font-family: monospace; color: #dd7230; font-size: 0.9em; font-weight: 500; background: rgba(221,114,48,0.08); padding: 2px 6px; border-radius: 5px; letter-spacing: 0.05em; }
        .pronunciation-details { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        
        .issue-original { color: #b71c1c; }
        .issue-arrow { color: rgba(46,31,39,0.35); }
        .issue-fix { color: #2e7d32; }
        .issue-rule { font-size: 0.75rem; color: rgba(46,31,39,0.4); background: rgba(46,31,39,0.05); padding: 2px 8px; border-radius: 6px; }
        .filler-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .filler-chip {
          padding: 4px 12px;
          background: rgba(133,77,39,0.1); border: 1px solid rgba(133,77,39,0.2);
          border-radius: 99px; font-size: 0.8125rem; color: #854d27;
        }
        .suggestion-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .suggestion-list li { font-size: 0.875rem; color: rgba(46,31,39,0.6); padding-left: 16px; position: relative; }
        .suggestion-list li::before { content: '→'; position: absolute; left: 0; color: #dd7230; }
      `}</style>
    </div>
  );
}

/* ── Inline Pronunciation Transcript Component ─────────────────────────── */
function PronunciationTranscript({
  transcript,
  flags,
}: {
  transcript: string;
  flags: PronunciationFlag[];
}) {
  const [activeFlag, setActiveFlag] = useState<number | null>(null);

  // Build a map of lowercase word → flag index for quick lookup
  const flagMap = new Map<string, number>();
  flags.forEach((f, i) => {
    flagMap.set(f.word.toLowerCase().replace(/[^a-z']/g, ''), i);
  });

  // Tokenise transcript preserving spaces and punctuation so we can re-render inline
  const tokens = transcript
    ? transcript.split(/(\s+)/)
    : ['(no transcript available)'];

  function clean(t: string) {
    return t.toLowerCase().replace(/[^a-z']/g, '');
  }

  const selectedFlag = activeFlag !== null ? flags[activeFlag] : null;

  return (
    <div className="pron-section">
      {/* Inline highlighted transcript */}
      <div className="pron-transcript-box" aria-label="Transcript with pronunciation errors highlighted">
        {tokens.map((token, i) => {
          const key = clean(token);
          const idx = flagMap.get(key);
          if (idx !== undefined) {
            return (
              <span
                key={i}
                className={`pron-flagged${activeFlag === idx ? ' pron-active' : ''}`}
                onClick={() => setActiveFlag(activeFlag === idx ? null : idx)}
                title="Click for pronunciation tip"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveFlag(activeFlag === idx ? null : idx)}
              >
                {token}
              </span>
            );
          }
          return <span key={i} className="pron-word">{token}</span>;
        })}
      </div>

      {/* Detail panel for selected word */}
      {selectedFlag && (
        <div className="pron-detail-panel" role="region" aria-label={`Tip for ${selectedFlag.word}`}>
          <div className="pron-detail-word">
            <span className="pron-detail-flagged-word">{selectedFlag.word}</span>
            {selectedFlag.phoneticBreakdown && (
              <span className="pron-detail-phonetic">/{selectedFlag.phoneticBreakdown}/</span>
            )}
          </div>
          <p className="pron-detail-issue">⚠️ {selectedFlag.issue}</p>
          <p className="pron-detail-suggestion">💡 {selectedFlag.suggestion}</p>
        </div>
      )}

      {/* Full flagged word list */}
      <div className="pron-flag-list" aria-label="All pronunciation flags">
        {flags.map((f, i) => (
          <div
            key={i}
            className="pron-flag-row"
            onClick={() => setActiveFlag(activeFlag === i ? null : i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveFlag(activeFlag === i ? null : i)}
          >
            <span className="pron-flag-word-badge">{f.word}</span>
            <div className="pron-flag-info">
              {f.phoneticBreakdown && <span className="pron-flag-phonetic">/{f.phoneticBreakdown}/</span>}
              <span className="pron-flag-issue-text">{f.issue}</span>
              <span className="pron-flag-suggestion">→ {f.suggestion}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="pron-correct-btn"
        onClick={() => setActiveFlag(0)}
        aria-label="Start correcting pronunciation errors"
      >
        Let's correct them →
      </button>
    </div>
  );
}

function DimensionTab({ score, label, advice, icon, title, children }: {
  score: number; label: string; advice: string; icon: string; title: string; children?: React.ReactNode;
}) {
  function scoreColor(s: number) {
    if (s >= 85) return '#2e7d32';
    if (s >= 65) return '#dd7230';
    if (s >= 45) return '#854d27';
    return '#b71c1c';
  }
  return (
    <div className="dimension-tab">
      <div className="dimension-header">
        <div className="dimension-title-row">
          <span className="dim-icon">{icon}</span>
          <span className="dim-title">{title}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="dim-score" style={{ color: scoreColor(score) }}>{score}</div>
          <div className="dim-label">{label}</div>
        </div>
      </div>
      <p className="advice-box">{advice}</p>
      {children}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-chip">
      <span className="stat-chip-label">{label}</span>
      <span className="stat-chip-value">{value}</span>
    </div>
  );
}
