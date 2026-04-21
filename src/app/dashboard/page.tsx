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

const NAV = [
  { icon: I.home, label: 'Home', active: true },
  { icon: I.book, label: 'Practice', active: false },
  { icon: I.chart, label: 'Analytics', active: false },
  { icon: I.user, label: 'Profile', active: false },
];

export default function Dashboard() {
  return (
    <div className={styles.shell}>
      {/* ── Sidebar (Desktop) / Bottom Nav (Mobile) ── */}
      <aside className={styles.sidebar} aria-label="Main navigation">
        <div className={styles.navTop}>
          <div className={styles.navLogo} aria-hidden="true">{I.mic}</div>
          <nav className={styles.navMenu} aria-label="Site sections">
            {NAV.map(({ icon, label, active }) => (
              <button
                key={label}
                className={`${styles.navBtn}${active ? ' ' + styles.active : ''}`}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                {icon}
                <span className={styles.navLabel}>{label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className={styles.navFoot}>
          <button className={`${styles.navBtn} ${styles.hideMobile}`} aria-label="Settings">
            {I.settings}
          </button>
          <div className={`${styles.avatar} ${styles.hideMobile}`} role="img" aria-label="Your profile">D</div>
        </div>
      </aside>

      {/* ── Main content column ── */}
      <div className={styles.main}>

        {/* Topbar */}
        <header className={styles.topbar}>
          {/* Mobile Topbar Left: Greeting */}
          <div className={styles.mobileGreetingBox}>
            <p className={styles.greetingSub}>Ready to practise,</p>
            <h1 className={styles.greeting}>Dennis</h1>
          </div>

          {/* Desktop Topbar Left: Search */}
          <div className={styles.searchBox} role="search">
            {I.search}
            <input
              placeholder="Search scenarios…"
              className={styles.searchInput}
              aria-label="Search scenarios"
              type="search"
            />
          </div>

          {/* Topbar Right: Actions */}
          <div className={styles.topbarActions}>
            <button className={`${styles.iconBtn} ${styles.mobileSearchBtn}`} aria-label="Search">
              {I.search}
            </button>
            <button className={styles.iconBtn} aria-label="Notifications">
              {I.bell}
              <span className={styles.notifBadge} aria-hidden="true" />
            </button>
            <div className={`${styles.userChip} ${styles.hideMobile}`} aria-label="Signed in as Dennis">
              <div className={`${styles.avatar} ${styles.avatarSm}`} aria-hidden="true">D</div>
              <span>Dennis</span>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className={styles.body} id="main-content">

          {/* Desktop Only header */}
          <div className={styles.desktopHeader}>
            <div className={styles.greetingGroup}>
              <p className={styles.greetingSub}>Ready to practise,</p>
              <h1 className={styles.greeting}>Dennis</h1>
            </div>
            <Link href="/practice" className={styles.ctaBtnPrimary}>
              {I.mic}
              Start speaking · 15 min
            </Link>
          </div>

          {/* Pill filter tabs */}
          <div className={styles.filterTabs} role="tablist" aria-label="Filter by skill">
            {['All', 'Speaking', 'Listening', 'Vocabulary'].map((t, i) => (
              <button
                key={t}
                role="tab"
                aria-selected={i === 0}
                className={`${styles.tab}${i === 0 ? ' ' + styles.active : ''}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Mobile Only: Daily Goal highlights before the grid */}
          <div className={`${styles.card} ${styles.goalCardMobile}`}>
            <div className={styles.cardHeaderWrap}>
              <span className={styles.goalEyebrow}>Daily Goal</span>
              <span className={styles.streakBadgeInline} aria-label="3-day streak">
                {I.fire} 3 days
              </span>
            </div>
            <p className={styles.goalTextDark}>Speak for 15 minutes to build your streak</p>
            <div className={styles.goalProgressTrack} role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} aria-label="Daily goal progress">
              <div className={styles.goalProgressFill} style={{ transform: 'scaleX(0.4)' }} />
            </div>
            <div className={styles.goalFoot}>
              <span className={styles.goalProgressLabelDarkMobile}>6 min done · 9 to go</span>
              <Link href="/practice" className={styles.ctaBtnOutline}>
                {I.mic} Begin session
              </Link>
            </div>
          </div>

          {/* Content grid */}
          <div className={styles.grid}>

            {/* ── Left column ── */}
            <div className={styles.colLeft}>

              {/* Progress summary card */}
              <div className={`${styles.card} ${styles.progressCard}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>Today&apos;s progress</span>
                  <span className={`${styles.streakBadgeOutline} ${styles.hideMobile}`} aria-label="3-day streak">
                    {I.fire} 3-day streak
                  </span>
                </div>
                
                <div className={styles.statsRow}>
                  <div className={styles.statWrapLeft}>
                    <div className={styles.statBox}>
                      <span className={styles.statN}>15<span className={`${styles.statU_inline} ${styles.hideMobile}`}>m</span></span>
                      <span className={styles.statU}>goal today</span>
                    </div>
                    <div className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.statBox}>
                      <span className={styles.statN}>124</span>
                      <span className={styles.statU}>words spoken</span>
                    </div>
                  </div>
                  
                  <div className={`${styles.statDivider} ${styles.hideMobile}`} aria-hidden="true" />
                  
                  <div className={styles.statWrapRight}>
                    <div className={styles.statBox}>
                      <span className={styles.statN}>84<span className={styles.statU_inline}>%</span></span>
                      <span className={styles.statU}>accuracy</span>
                    </div>
                    <div className={styles.statDivider} aria-hidden="true" />
                    <div className={styles.statBox}>
                      <span className={styles.statN}>4.5<span className={styles.statU_inline}>h</span></span>
                      <span className={styles.statU}>this week</span>
                    </div>
                  </div>
                </div>

                <div className={styles.weekChart} aria-label="Activity this week" role="img">
                  {WEEK_BARS.map((h, i) => {
                    const isFuture = i >= FUTURE_FROM;
                    const scale = h / 100;
                    return (
                      <div key={i} className={styles.barCol}>
                        <div
                          className={`${styles.bar}${isFuture ? ' ' + styles.barFuture : ''}`}
                          style={{ transform: `scaleY(${isFuture ? 0 : Math.max(scale, 0.03)})` }}
                          aria-hidden="true"
                        />
                        <span className={`${styles.barDay}${isFuture ? ' ' + styles.barDayFuture : ''}`}>
                          {'MTWTFSS'[i]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scenario list */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <h2 className={styles.cardTitle}>Recommended scenarios</h2>
                    <span className={`${styles.cardSubtitle} ${styles.hideDesktop}`}>Real-world conversations, graded by difficulty</span>
                  </div>
                  <button className={`${styles.textLink} ${styles.hideMobile}`} aria-label="View all scenarios">
                    View all
                  </button>
                </div>
                <div className={styles.scenarioList}>
                  {SCENARIOS.map(({ label, sub, tag, color }) => (
                    <button key={label} className={styles.scenarioRow} aria-label={`Start ${label} scenario — ${tag}`}>
                      <div className={styles.scenarioDot} style={{ background: color }} aria-hidden="true" />
                      <div className={styles.scenarioInfo}>
                        <span className={styles.scenarioName}>{label}</span>
                        <span className={styles.scenarioSub}>{sub}</span>
                      </div>
                      <span className={styles.tag}>{tag}</span>
                      <span className={`${styles.scenarioArrow} ${styles.hideMobile}`} aria-hidden="true">{I.arrow}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile-only recent activity embedded in left column */}
              <div className={`${styles.card} ${styles.recentCardMobile}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>Recent sessions</span>
                </div>
                {ACTIVITY.length === 0 ? (
                  <div className={styles.emptyState}>No sessions yet.<br />Start your first one above →</div>
                ) : (
                  <div className={styles.activityList}>
                    {ACTIVITY.map(({ label, score, time }) => (
                      <div key={label} className={styles.activityRow}>
                        <div className={styles.activityInfo}>
                          <span className={styles.activityName}>{label}</span>
                          <span className={styles.activityTime}>{time}</span>
                        </div>
                        <span className={styles.scoreBadge} data-score={scoreGrade(score)} aria-label={`Score: ${score}%`}>
                          {score}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* ── Right column (Desktop only via CSS Grid config) ── */}
            <div className={styles.colRight}>

              {/* Daily goal highlight card */}
              <div className={`${styles.card} ${styles.goalCardDesktop}`}>
                <span className={styles.goalEyebrow}>Daily goal</span>
                <p className={styles.goalTextDark}>Speak for 15 minutes to build your streak</p>
                <div className={styles.goalProgressTrack} role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} aria-label="Daily goal progress">
                  <div className={styles.goalProgressFill} style={{ transform: 'scaleX(0.4)' }} />
                </div>
                <span className={styles.goalProgressLabelDark}>6 min completed · 9 to go</span>
              </div>

              {/* Recent activity */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>Recent sessions</span>
                </div>
                {ACTIVITY.length === 0 ? (
                  <div className={styles.emptyState}>
                    No sessions yet.<br />Start your first one above →
                  </div>
                ) : (
                  <div className={styles.activityList}>
                    {ACTIVITY.map(({ label, score, time }) => (
                      <div key={label} className={styles.activityRow}>
                        <div className={styles.activityInfo}>
                          <span className={styles.activityName}>{label}</span>
                          <span className={styles.activityTime}>{time}</span>
                        </div>
                        <span className={styles.scoreBadge} data-score={scoreGrade(score)} aria-label={`Score: ${score}%`}>
                          {score}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grade card */}
              <div className={`${styles.card} ${styles.gradeCard}`}>
                <div className={styles.gradeInner}>
                  <div>
                    <div className={styles.gradeLabel}>Pronunciation grade</div>
                    <div className={styles.gradeValue} aria-label="Grade: A minus">A−</div>
                    <div className={styles.gradeSubLabel}>Based on last 3 sessions</div>
                  </div>
                  <div className={styles.gradeRing} aria-hidden="true">
                    <svg width={72} height={72} role="presentation">
                      <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(221,114,48,0.12)" strokeWidth="6" />
                      <circle cx="36" cy="36" r="30" fill="none" stroke="#dd7230" strokeWidth="6"
                        strokeDasharray={`${0.84 * 2 * Math.PI * 30} ${2 * Math.PI * 30}`}
                        strokeLinecap="round"
                        transform="rotate(-90 36 36)"
                      />
                    </svg>
                    <span className={styles.gradeRingPct}>84%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className={styles.safeBottomInset} aria-hidden="true" />
        </main>
      </div>
    </div>
  );
}
