'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSessions, getStats, type SessionStats } from '@/lib/storage/sessions';
import type { PracticeSession } from '@/lib/ai/feedback-schema';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);

  useEffect(() => {
    setSessions(getSessions());
    setStats(getStats());
  }, []);

  function scoreColor(s: number) {
    if (s >= 85) return 'var(--color-success)';
    if (s >= 65) return 'var(--color-primary)';
    if (s >= 45) return 'var(--color-warning)';
    return 'var(--color-error)';
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <main className="dashboard-page">
      <div className="glow-orb glow-orb-primary" style={{ top: '-80px', right: '10%' }} aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Your Progress</h1>
            <p className="dash-subtitle">Track your speaking improvement over time</p>
          </div>
          <Link href="/practice" className="btn btn-primary">
            🎙️ Practice Now
          </Link>
        </header>

        {sessions.length === 0 ? (
          <div className="empty-state glass-card animate-fade-up">
            <div className="empty-icon">🎤</div>
            <h2>No sessions yet</h2>
            <p>Complete your first practice session to start tracking your progress.</p>
            <Link href="/practice" className="btn btn-primary">Start Practising</Link>
          </div>
        ) : (
          <>
            {/* Stats row */}
            {stats && (
              <div className="stats-grid animate-fade-up">
                <StatCard icon="🏆" label="Best Score" value={String(stats.bestScore)} />
                <StatCard icon="📈" label="Average Score" value={String(stats.averageScore)} />
                <StatCard icon="🎯" label="Sessions" value={String(stats.totalSessions)} />
                <StatCard icon="🔥" label="Day Streak" value={`${stats.streakDays}d`} />
                {stats.mostPracticedScenario && (
                  <StatCard icon="⭐" label="Top Scenario" value={stats.mostPracticedScenario} small />
                )}
              </div>
            )}

            {/* Weekly trend */}
            {stats && stats.weeklyScores.length > 1 && (
              <div className="glass-card trend-card animate-fade-up delay-100">
                <h2 className="section-heading">7-Day Trend</h2>
                <div className="mini-chart">
                  {stats.weeklyScores.map((ws, i) => (
                    <div key={i} className="chart-bar-col">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${ws.score}%`,
                          background: scoreColor(ws.score),
                        }}
                        title={`${ws.date}: ${ws.score}`}
                      />
                      <span className="chart-label">{ws.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session history */}
            <div className="animate-fade-up delay-200">
              <h2 className="section-heading">Session History</h2>
              <div className="session-list">
                {sessions.map((session) => (
                  <div key={session.id} className="session-row glass-card">
                    <div className="session-info">
                      <span className="session-scenario">{session.scenarioName}</span>
                      <span className="session-prompt">"{session.prompt}"</span>
                      <span className="session-date">{formatDate(session.createdAt)}</span>
                    </div>
                    <div className="session-stats">
                      <div className="session-score" style={{ color: scoreColor(session.feedback.overall.score) }}>
                        {session.feedback.overall.score}
                      </div>
                      <div className="session-label">{session.feedback.overall.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .dashboard-page { min-height: 100vh; padding: var(--space-8) 0 var(--space-16); position: relative; }
        .dash-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: var(--space-10); gap: var(--space-4); flex-wrap: wrap;
        }
        .dash-title { margin-bottom: var(--space-2); }
        .dash-subtitle { color: var(--color-text-muted); max-width: none; }

        /* Stats */
        .stats-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: var(--space-4); margin-bottom: var(--space-6);
        }
        .stat-card {
          background: var(--color-bg-glass); backdrop-filter: blur(20px);
          border: 1px solid var(--color-border); border-radius: var(--radius-xl);
          padding: var(--space-5) var(--space-4);
          display: flex; flex-direction: column; gap: var(--space-2);
        }
        .stat-icon { font-size: 1.25rem; }
        .stat-label { font-size: 0.75rem; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; }
        .stat-value { font-size: 1.75rem; font-weight: 800; font-family: var(--font-heading); color: var(--color-text); }
        .stat-value-sm { font-size: 1rem; }

        /* Trend chart */
        .trend-card { margin-bottom: var(--space-6); }
        .section-heading { font-size: 1rem; font-weight: 700; color: var(--color-text-muted); margin-bottom: var(--space-4); text-transform: uppercase; letter-spacing: 0.06em; }
        .mini-chart {
          display: flex; align-items: flex-end; gap: var(--space-2);
          height: 100px;
        }
        .chart-bar-col { display: flex; flex-direction: column; align-items: center; gap: var(--space-1); flex: 1; height: 100%; justify-content: flex-end; }
        .chart-bar { width: 100%; border-radius: var(--radius-sm) var(--radius-sm) 0 0; min-height: 4px; transition: height 0.5s ease; }
        .chart-label { font-size: 0.65rem; color: var(--color-text-subtle); }

        /* Session list */
        .session-list { display: flex; flex-direction: column; gap: var(--space-3); }
        .session-row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
        .session-info { display: flex; flex-direction: column; gap: var(--space-1); flex: 1; min-width: 0; }
        .session-scenario { font-weight: 600; font-size: 0.9rem; color: var(--color-text); }
        .session-prompt { font-size: 0.8rem; color: var(--color-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .session-date { font-size: 0.75rem; color: var(--color-text-subtle); }
        .session-stats { text-align: right; flex-shrink: 0; }
        .session-score { font-size: 1.75rem; font-weight: 900; font-family: var(--font-heading); }
        .session-label { font-size: 0.7rem; color: var(--color-text-subtle); text-transform: capitalize; margin-top: -2px; }

        /* Empty */
        .empty-state {
          display: flex; flex-direction: column; align-items: center; gap: var(--space-4);
          padding: var(--space-16) var(--space-8); text-align: center; margin-top: var(--space-8);
        }
        .empty-icon { font-size: 3rem; }
        .empty-state p { max-width: 36ch; }
      `}</style>
    </main>
  );
}

function StatCard({ icon, label, value, small }: { icon: string; label: string; value: string; small?: boolean }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${small ? 'stat-value-sm' : ''}`}>{value}</span>
    </div>
  );
}
