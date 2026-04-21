# Kaizen — Design Product Requirements Document (PRD)

## 1. Executive Summary
This document outlines the core design identity, brand personality, and technical aesthetic execution for Kaizen. It serves as the single source of truth for UI/UX developers to ensure a consistent, premium, and welcoming user experience across all web and application touchpoints.

---

## 2. Target Audience & Empathy Goals
The core users are **Language Learners** practicing speech in interactive audio scenarios to receive intelligent phonetic and conversational feedback. 

**Emotional Objectives:**
- **Reduce Anxiety:** Learning and speaking a new language is inherently vulnerable. The UI must feel like a safe, judgment-free zone.
- **Inspire Confidence:** Progress tracking should feel rewarding and encouraging, not punitive.
- **Maintain Focus:** The interface should never overwhelm; simplicity and gentle guidance are paramount.

---

## 3. Brand Identity & Personality
Kaizen aims for an intersection of high-end software craftsmanship and warm, human-centric learning.
- **3-Word Personality:** Cozy, Premium, Inviting.
- **Tone of Voice:** Encouraging, refined, playful yet sharply polished. 
- **Anti-References:** We are avoiding aggressive gamification (like DuoLingo's red threat models), overly clinical tech aesthetics, or generic "AI dark mode slop" (no neon borders or cyan gradients). 

---

## 4. Aesthetic Direction
The overarching direction is defined as a **"Cozy Pastel Light Mode"** utilizing high-end structural details. 
- **Palette Baseline:** Soft pastels (creamy whites, soft lavenders, gentle blues/greens, and warm earth/orange tones). 
- **Inspiration:** Premium travel application and modern lifestyle apps.
- **Component Formats:** Large full-bleed visual elements, smooth glassy overlaps, floating pill-based navigation, and highly refined typographic alignments.
- **Responsive Stance:** It should feel like a high-end native mobile application that happens to live securely on the web. 

---

## 5. Core Design Principles

### Principle 1: Soft Depth over Flatness
We firmly reject flat design and harsh stroke-borders. 
- Instead, elements are separated by **soft, diffused, multi-layered box-shadows**. 
- Deep and layered transparent shadows `(e.g., 0 24px 48px oklch(0 0 0 / 0.04))` provide stacking context.
- UI elements overlapping mesh gradients use high-blur `backdrop-filter: blur(16px)` to create premium "glassmorphism" without feeling overly busy.

### Principle 2: Immersive Framing & Fluidity 
Layouts are anchored by **edge-to-edge structural blocks** rather than repetitive grids of identical cards.
- Backgrounds utilize **OKLCH Radial and Mesh Gradients**. Linear sweeps combine warm hues (like 98% Lightness, 0.03 Chroma oranges/pinks) to construct serene skylines.
- Distinctive organic shapes, such as vector **"squiggly lines"** with subtle stroke variance, live in the background of cards to create motion and artistry.

### Principle 3: Deliberate Typographical Hierarchy
Typography relies on massive contrast.
- **Headings:** Very large font sizing configured using `clamp()` (e.g., `clamp(3rem, 6vw, 5.5rem)`) for fully fluid scaling. Typefaces are geometric but warm (e.g. `Outfit`). Wait weights are typically medium (500-600) with slight negative tracking `(letter-spacing: -0.04em)` for a tight, editorial look.
- **Body Text:** Subdued contrast `(oklch(0.45 0.01 240))` to prevent visual exhaustion. 

### Principle 4: Mobile-First Purity
While we expand beautifully for desktop, the core component layouts are native-first.
- Tighter paddings.
- Pill buttons `(border-radius: 999px)`.
- Use of icons directly mapped next to touch-friendly actionable text.

---

## 6. Technical Execution Guidelines

### Colors (Oklch Requirement)
Colors must always be constructed using `oklch` for perceptually uniform blending and luminance control. Never use `#hex` or `hsl` defaults for themes.
- **Backgrounds:** `oklch(0.98 0.01 75)` to `oklch(0.95 0.01 120)` (Warm ivory to muted cream notes).
- **Primary Texts:** `oklch(0.25 0.01 240)`
- **Muted Accents:** Reduced chroma colors applied generously to avoid loud spikes.

### Absolute Bans (Anti-Patterns)
The following are strictly banned to avoid generic "AI" interfaces:
1. **Gradient Text:** Avoid `background-clip: text`. Use solid colors for readability and impact.
2. **Left-Border Warning Stripes:** Ban `border-left` width patterns for cards or callouts. Rely on full borders or subtle tinting instead.
3. **Card-in-Card Nesting:** Keep structures visually flat without adding infinite containers.

### Motion & Micro-Interactions
- Hover effects utilize explicit vertical translations `transform: translateY(-2px)` coupled with slight shadow expansion.
- Easing defaults should be snappy but organic: `cubic-bezier(0.16, 1, 0.3, 1)` to reflect deliberate, weighted movements.

---
*Generated based on the .impeccable interface guidelines and the Kaizen Landing Hero Component styling properties.*
