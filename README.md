# SpeakDennis

SpeakDennis is a comprehensive practice suite and dashboard designed for public speakers, job seekers, and content creators. It provides an interactive space to hone your speaking skills and manage your content strategy.

## What This Solves

Public speaking and job interviews require consistent practice, while content creation demands staying updated on industry trends. SpeakDennis solves these challenges by combining:

- **Impromptu Speaking Practice:** An interactive "Impromptu Challenge" mode where users practice speaking based on random topic prompts (choose between one word, two words, or a full sentence) along with a dice-roll mechanic that determines the speaking duration. This builds quick-thinking and improvisation skills.
- **Conversational AI Interview Mode:** A mock interview environment featuring a conversational AI. It uses the Speechify API to provide high-quality text-to-speech audio, alongside a character-based chat UI that displays meeting transcripts so users can review and evaluate their performance.
- **Content Creator Dashboard:** A dedicated space for content creators to gain competitive insights. It includes an Instagram competitor tracking module and an RSS-based content idea generator to help creators plan out their next big piece of content.

## What I Learned

Building this project provided extensive hands-on experience across multiple domains:

- **API Integration & Text-to-Speech:** Integrating the Speechify API to generate natural, high-quality audio for the AI interviewer.
- **Third-Party Auth & Graph APIs:** Setting up the Meta Developers dashboard, handling account linking, and configuring the Instagram Graph API to retrieve competitor data.
- **Modern Frontend Architecture:** Utilizing Next.js, React, TypeScript, and Tailwind CSS to create a premium, modular user interface.
- **State Management:** Leveraging Redux Toolkit to manage complex UI states, such as tracking the conversation history in the interview mode and the active status of dashboard modules.
- **Dynamic UI/UX:** Implementing interactive features like the randomized dice roll and dynamically generating character-based chat bubbles for interview transcripts.

## Future Features

The roadmap for SpeakDennis includes:

- **Live Data Integration:** Transitioning the Content Creator Dashboard from mock data to real-time live API feeds.
- **Advanced Performance Analytics:** Implementing AI-driven analysis of interview transcripts to detect filler words, measure speaking pace, and perform sentiment analysis.
- **Expanded AI Personas:** Adding more diverse and customizable AI interviewer personas tailored for specific industries or roles.
- **Multi-Platform Tracking:** Extending the competitor tracking module to support additional platforms like YouTube, LinkedIn, and TikTok. 
- **User Authentication:** Implementing full user accounts to save practice history, track progress over time, and persist dashboard settings.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.
