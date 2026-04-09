'use client';
import Link from 'next/link';
import styles from './page.module.css';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const I = {
  home: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  book: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  chart: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  user: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  mic: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  bell: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  search: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  settings: (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  arrow: (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  fire: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SCENARIOS = [
  { label: 'Job Interview',  sub: 'Tech & behavioural Q&A',    tag: 'Intermediate', color: '#dd7230' },
  { label: 'Coffee Shop',   sub: 'Casual everyday chat',       tag: 'Beginner',     color: '#854d27' },
  { label: 'Presentation',  sub: 'Structured public speaking', tag: 'Advanced',     color: '#2e1f27' },
  { label: 'First Date',    sub: 'Light conversational flow',  tag: 'Beginner',     color: '#854d27' },
];

const ACTIVITY: { label: string; score: number; time: string }[] = [
  { label: 'Coffee Shop Practice', score: 92, time: '2h ago'    },
  { label: 'Job Interview Run',    score: 78, time: 'Yesterday' },
  { label: 'Pronunciation Drill',  score: 88, time: '2 days ago'},
];

// normalize: map score to semantic data-score value
function scoreGrade(score: number): 'high' | 'mid' | 'low' {
  if (score >= 90) return 'high';
  if (score >= 80) return 'mid';
  return 'low';
}

// Week bar data: values for M-S; 0 = today or future
const WEEK_BARS = [40, 65, 30, 80, 95, 50, 0];
// Today is Saturday (index 5); Sunday (index 6) is future
const FUTURE_FROM = 6;

// ─── Desktop navigation items ─────────────────────────────────────────────────
const D_NAV = [
  { icon: I.home,  label: 'Home',    active: true  },
  { icon: I.book,  label: 'Lessons', active: false },
  { icon: I.chart, label: 'Stats',   active: false },
  { icon: I.user,  label: 'Profile', active: false },
];

export default function Dashboard() {
  return (
    <>
      {/* ═══════ DESKTOP ═══════ */}
      <div className={styles.dShell}>

        {/* Icon-only dark sidebar */}
        <aside className={styles.dSidebar} aria-label="Main navigation">
          {/* Logo icon — decorative */}
          <div className={styles.dLogoIcon} aria-hidden="true">{I.mic}</div>

          <nav className={styles.dNav} aria-label="Site sections">
            {D_NAV.map(({ icon, label, active }) => (
              <button
                key={label}
                className={`${styles.dNavBtn}${active ? ' ' + styles.active : ''}`}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                {icon}
              </button>
            ))}
          </nav>

          <div className={styles.dSidebarFoot}>
            <button className={styles.dNavBtn} aria-label="Settings">
              {I.settings}
            </button>
            {/* Avatar — initials badge */}
            <div className={styles.dAvatar} role="img" aria-label="Your profile">D</div>
          </div>
        </aside>

        {/* Main content column */}
        <div className={styles.dMain}>

          {/* Topbar */}
          <header className={styles.dTopbar}>
            <div className={styles.dSearch} role="search">
              {I.search}
              <input
                placeholder="Search scenarios…"
                className={styles.dSearchInput}
                aria-label="Search scenarios"
                type="search"
              />
            </div>
            <div className={styles.dTopbarRight}>
              <button className={styles.dBell} aria-label="Notifications">
                {I.bell}
                <span className={styles.dNotif} aria-hidden="true" />
              </button>
              <div className={styles.dUserChip} aria-label="Signed in as Dennis">
                <div className={`${styles.dAvatar} ${styles.sm}`} aria-hidden="true">D</div>
                <span>Dennis</span>
              </div>
            </div>
          </header>

          {/* Page body */}
          <main className={styles.dBody} id="main-content">

            {/* Page header — arrange: CTA connected to greeting as one unified row */}
            <div className={styles.dPageHeader}>
              <div className={styles.dGreetingGroup}>
                {/* clarify: warmer sub-greeting */}
                <p className={styles.dGreetingSub}>Ready to practise,</p>
                <h1 className={styles.dGreeting}>Dennis</h1>
              </div>
              {/* clarify: specific CTA copy */}
              <Link href="/practice" className={styles.dCtaBtn}>
                {I.mic}
                Start speaking · 15 min
              </Link>
            </div>

            {/* Pill filter tabs */}
            <div className={styles.dTabs} role="tablist" aria-label="Filter by skill">
              {['All', 'Speaking', 'Listening', 'Vocabulary'].map((t, i) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={i === 0}
                  className={`${styles.dTab}${i === 0 ? ' ' + styles.active : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Content grid */}
            <div className={styles.dGrid}>

              {/* ── Left column ── */}
              <div className={styles.dColLeft}>

                {/* Progress summary card */}
                <div className={`${styles.dCard} ${styles.dProgressCard}`}>
                  <div className={styles.dCardHeader}>
                    <span className={styles.dCardTitle}>Today&apos;s progress</span>
                    <span className={styles.dStreakChip} aria-label="3-day streak">
                      {I.fire} 3-day streak
                    </span>
                  </div>
                  {/* clarify: improved stat labels */}
                  <div className={styles.dStatsRow}>
                    <div className={styles.dStat}>
                      <span className={styles.dStatN}>15</span>
                      <span className={styles.dStatU}>goal today</span>
                    </div>
                    <div className={styles.dStatDivider} aria-hidden="true" />
                    <div className={styles.dStat}>
                      <span className={styles.dStatN}>124</span>
                      <span className={styles.dStatU}>words spoken</span>
                    </div>
                    <div className={styles.dStatDivider} aria-hidden="true" />
                    <div className={styles.dStat}>
                      <span className={styles.dStatN}>
                        84<span className={styles.dStatPct}>%</span>
                      </span>
                      <span className={styles.dStatU}>accuracy</span>
                    </div>
                    <div className={styles.dStatDivider} aria-hidden="true" />
                    <div className={styles.dStat}>
                      <span className={styles.dStatN}>
                        4.5<span className={styles.dStatPct}>h</span>
                      </span>
                      <span className={styles.dStatU}>this week</span>
                    </div>
                  </div>

                  {/* animate: bar chart via transform: scaleY */}
                  <div className={styles.dWeekChart} aria-label="Activity this week" role="img">
                    {WEEK_BARS.map((h, i) => {
                      const isFuture = i >= FUTURE_FROM;
                      const scale = h / 100;
                      return (
                        <div key={i} className={styles.dBarCol}>
                          <div
                            className={`${styles.dBar}${isFuture ? ' ' + styles.dBarFuture : ''}`}
                            style={{ transform: `scaleY(${isFuture ? 0 : Math.max(scale, 0.03)})` }}
                            aria-hidden="true"
                          />
                          <span className={`${styles.dBarDay}${isFuture ? ' ' + styles.dBarDayFuture : ''}`}>
                            {'MTWTFSS'[i]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scenario list */}
                <div className={styles.dCard}>
                  <div className={styles.dCardHeader}>
                    <span className={styles.dCardTitle}>Recommended scenarios</span>
                    <button className={styles.dTextLink} aria-label="View all scenarios">
                      View all
                    </button>
                  </div>
                  {/* clarify: add a context hint */}
                  <div className={styles.dScenarioList}>
                    {SCENARIOS.map(({ label, sub, tag, color }) => (
                      <button key={label} className={styles.dScenarioRow} aria-label={`Start ${label} scenario — ${tag}`}>
                        <div
                          className={styles.dScenarioDot}
                          style={{ background: color }}
                          aria-hidden="true"
                        />
                        <div className={styles.dScenarioInfo}>
                          <span className={styles.dScenarioName}>{label}</span>
                          <span className={styles.dScenarioSub}>{sub}</span>
                        </div>
                        <span className={styles.dTag}>{tag}</span>
                        <span className={styles.dScenarioArrow} aria-hidden="true">{I.arrow}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right column ── */}
              <div className={styles.dColRight}>

                {/* Daily goal highlight card */}
                <div className={`${styles.dCard} ${styles.dGoalCard}`}>
                  {/* clarify: eyebrow label */}
                  <span className={styles.dGoalEyebrow}>Daily goal</span>
                  {/* clarify: warmer, action-oriented goal text */}
                  <p className={styles.dGoalText}>
                    Speak for 15 minutes to build your streak
                  </p>
                  {/* animate: progress uses scaleX transform via CSS; width drives it */}
                  <div
                    className={styles.dGoalProgressTrack}
                    role="progressbar"
                    aria-valuenow={40}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Daily goal progress"
                  >
                    <div
                      className={styles.dGoalProgressFill}
                      style={{ transform: 'scaleX(0.4)' }}
                    />
                  </div>
                  {/* clarify: more informative progress copy */}
                  <span className={styles.dGoalProgressLabel}>6 min completed · 9 to go</span>
                </div>

                {/* Recent activity */}
                <div className={styles.dCard}>
                  <div className={styles.dCardHeader}>
                    <span className={styles.dCardTitle}>Recent sessions</span>
                  </div>
                  {/* harden: empty state */}
                  {ACTIVITY.length === 0 ? (
                    <div className={styles.dEmptyState}>
                      No sessions yet.<br />Start your first one above →
                    </div>
                  ) : (
                    <div className={styles.dActivityList}>
                      {ACTIVITY.map(({ label, score, time }) => (
                        <div key={label} className={styles.dActivityRow}>
                          <div className={styles.dActivityInfo}>
                            <span className={styles.dActivityName}>{label}</span>
                            <span className={styles.dActivityTime}>{time}</span>
                          </div>
                          {/* normalize: data-score replaces inline color style */}
                          <span
                            className={styles.dScore}
                            data-score={scoreGrade(score)}
                            aria-label={`Score: ${score}%`}
                          >
                            {score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grade card */}
                {/* polish: added sub-label for context */}
                <div className={`${styles.dCard} ${styles.dGradeCard}`}>
                  <div className={styles.dGradeInner}>
                    <div>
                      <div className={styles.dGradeLabel}>Pronunciation grade</div>
                      <div className={styles.dGradeValue} aria-label="Grade: A minus">A−</div>
                      {/* clarify: added context for the grade */}
                      <div className={styles.dGradeSubLabel}>Based on last 3 sessions</div>
                    </div>
                    <div className={styles.dGradeRing} aria-hidden="true">
                      <svg width={72} height={72} role="presentation">
                        <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(221,114,48,0.12)" strokeWidth="6" />
                        <circle cx="36" cy="36" r="30" fill="none" stroke="#dd7230" strokeWidth="6"
                          strokeDasharray={`${0.84 * 2 * Math.PI * 30} ${2 * Math.PI * 30}`}
                          strokeLinecap="round"
                          transform="rotate(-90 36 36)"
                        />
                      </svg>
                      <span className={styles.dGradeRingPct}>84%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ═══════ MOBILE ═══════ */}
      <div className={styles.mShell}>
        <div className={styles.mBody}>

          {/* Header */}
          <header className={styles.mHeader}>
            <div>
              {/* clarify: warmer sub-greeting */}
              <p className={styles.mGreetingSub}>Ready to practise,</p>
              <h1 className={styles.mGreeting}>Dennis</h1>
            </div>
            <button className={styles.mBell} aria-label="Notifications">
              {I.bell}
              <span className={styles.mNotif} aria-hidden="true" />
            </button>
          </header>

          {/* Daily goal card */}
          <div className={`${styles.mGoalCard} ${styles.mCard}`}>
            <div className={styles.mGoalHeader}>
              <span className={styles.mGoalEyebrow}>Daily Goal</span>
              <span className={styles.mStreak} aria-label="3-day streak">
                {I.fire} 3 days
              </span>
            </div>
            {/* clarify: warmer, action-oriented goal text */}
            <p className={styles.mGoalText}>Speak for 15 minutes to build your streak</p>
            <div
              className={styles.mProgressTrack}
              role="progressbar"
              aria-valuenow={40}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Daily goal: 40% complete"
            >
              {/* animate: scaleX transition now defined in CSS */}
              <div
                className={styles.mProgressFill}
                style={{ transform: 'scaleX(0.4)' }}
              />
            </div>
            <div className={styles.mGoalFoot}>
              {/* clarify: more conversational progress text */}
              <span>6 min done · 9 to go</span>
              {/* clarify: specific CTA copy */}
              <Link href="/practice" className={styles.mStartBtn}>
                {I.mic} Begin session
              </Link>
            </div>
          </div>

          {/* Stats row */}
          {/* clarify: updated labels to be specific */}
          <div className={styles.mStats} aria-label="Today's stats">
            {[
              { n: '124', u: 'Words spoken' },
              { n: '84%', u: 'Accuracy' },
              { n: '4.5h', u: 'This week' },
            ].map(({ n, u }) => (
              <div key={u} className={styles.mStatItem}>
                <span className={styles.mStatN}>{n}</span>
                <span className={styles.mStatU}>{u}</span>
              </div>
            ))}
          </div>

          {/* Scenarios */}
          <div className={styles.mSection}>
            <div className={styles.mSectionHeader}>
              <h2 className={styles.mSectionTitle}>Scenarios</h2>
            </div>
            {/* clarify: added context hint below heading */}
            <p className={styles.mSectionHint}>Real-world conversations, graded by difficulty</p>
            {SCENARIOS.slice(0, 3).map(({ label, sub, tag, color }) => (
              <button
                key={label}
                className={styles.mScenario}
                aria-label={`${label} — ${tag}`}
              >
                <div
                  className={styles.mScenarioDot}
                  style={{ background: color }}
                  aria-hidden="true"
                />
                <div className={styles.mScenarioInfo}>
                  <span className={styles.mScenarioName}>{label}</span>
                  <span className={styles.mScenarioSub}>{sub}</span>
                </div>
                <span className={styles.mTag}>{tag}</span>
              </button>
            ))}
          </div>

          {/* Recent */}
          <div className={styles.mSection}>
            <h2 className={styles.mSectionTitle}>Recent sessions</h2>
            {/* harden: empty state */}
            {ACTIVITY.length === 0 ? (
              <div className={styles.mEmptyState}>
                No sessions yet.<br />Start your first one above →
              </div>
            ) : (
              ACTIVITY.map(({ label, score, time }) => (
                <div key={label} className={styles.mActivity}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className={styles.mActivityName}>{label}</p>
                    <p className={styles.mActivityTime}>{time}</p>
                  </div>
                  {/* normalize: data-score replaces inline color style */}
                  <span
                    className={styles.mScore}
                    data-score={scoreGrade(score)}
                    aria-label={`Score: ${score}%`}
                  >
                    {score}%
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Bottom spacer clears the nav bar */}
          <div style={{ height: 100 }} aria-hidden="true" />
        </div>

        {/* Bottom nav */}
        <nav className={styles.mNav} aria-label="Main navigation">
          {[
            { icon: I.home,  label: 'Home',    active: true  },
            { icon: I.book,  label: 'Lessons', active: false },
            { icon: I.chart, label: 'Stats',   active: false },
            { icon: I.user,  label: 'Profile', active: false },
          ].map(({ icon, label, active }) => (
            <button
              key={label}
              className={`${styles.mNavItem}${active ? ' ' + styles.active : ''}`}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              {icon}
              <span aria-hidden="true">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
