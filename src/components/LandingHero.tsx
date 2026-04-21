'use client';
import Link from 'next/link';
import styles from './LandingHero.module.css';

export default function LandingHero() {
  return (
    <div className={styles.heroContainer}>
      {/* Top Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          Kaizen
        </div>
        <div className={styles.navLinks}>
          <a className={styles.navLink}>Why us?</a>
          <a className={styles.navLink}>Methodology</a>
          <a className={styles.navLink}>Scenarios</a>
          <a className={styles.navLink}>Changelog</a>
        </div>
        <Link href="/practice" className={styles.navCta}>
          Start practicing
        </Link>
      </nav>

      {/* Headline & Side CTA */}
      <div className={styles.headerLayout}>
        <h1 className={styles.headline}>
          The personal stage for modern language learners
        </h1>
        <div className={styles.headerSide}>
          <div className={styles.sideCtaRow}>
            <Link href="/practice" className={styles.sideCtaBtn}>
              Start free session
            </Link>
            <button className={styles.sideArrowBtn} aria-label="Go">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
          <p className={styles.sideDesc}>
            Kaizen centralizes conversational data from your voice practice sessions, creating one clear view of your fluency over time.
          </p>
        </div>
      </div>

      {/* Visual Mesh Container */}
      <div className={styles.visualFrameContainer}>
        {/* Abstract Squiggly lines across background */}
        <svg className={styles.abstractSVG} viewBox="0 0 800 400" preserveAspectRatio="none">
          <path className={styles.squigglyPath} d="M-100,300 C 100,50 300,350 500,150 S 700,400 900,100" />
          <path className={styles.squigglyPath} style={{ stroke: 'oklch(0.8 0.15 70)', strokeWidth: '1' }} d="M-50,250 C 150,-10 350,450 550,50 S 750,450 950,50" />
        </svg>

        {/* Floating Card 1 */}
        <div className={styles.glassCard1}>
          <div className={styles.ringIcon}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="transparent" strokeWidth="8"/>
            </svg>
          </div>
          <div className={styles.cardText}>
            <div className={styles.cardVal}>124 <span>/ 150</span></div>
            <div className={styles.cardSubVal}>Words spoken today</div>
          </div>
          <div className={styles.toggleWrapper}>
            <div className={styles.toggleThumb} />
          </div>
        </div>

        {/* Floating Card 2 */}
        <div className={styles.glassCard2}>
          <div className={styles.card2Head}>
            <div className={styles.userAvatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <div className={styles.card2Title}>Advanced phonetic feedback</div>
              <div className={styles.card2SubTitle}>Pronunciation analysis enabled</div>
            </div>
          </div>
          <div className={styles.card2ActionRow}>
            <div className={`${styles.toggleWrapper} ${styles.inactiveToggle}`}>
              <div className={styles.toggleThumb} />
            </div>
            <span className={styles.activateLabel}>Activate</span>
            <button className={styles.learnMoreBtn}>
              Learn more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Features */}
      <div className={styles.bottomFeatures}>
        <div className={styles.feature}>
          <div className={styles.featureIconArea}>
            <div className={styles.featureIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div className={styles.featureIconShadow1} />
            <div className={styles.featureIconShadow2} />
          </div>
          <div className={styles.featureText}>
            <h3>Use voice on any device</h3>
            <p>We offer seamless practice experiences across devices, supporting everything from mobile browsers to desktop Chrome.</p>
          </div>
        </div>
        
        <div className={styles.feature}>
          <div className={styles.featureIconArea}>
            <div className={styles.featureIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className={styles.featureIconShadow1} />
            <div className={styles.featureIconShadow2} />
          </div>
          <div className={styles.featureText}>
            <h3>Cosy & private</h3>
            <p>Kaizen provides a judgment-free space. Practice privately with AI characters feeling as natural as a real-world chat.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
