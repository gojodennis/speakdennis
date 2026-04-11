# SpeakDennis

SpeakDennis is a comprehensive practice suite designed for public speakers and job seekers. It provides an interactive space to hone your impromptu speaking skills and practice for interviews.

## What This Solves

Public speaking and job interviews require consistent practice to build confidence and fluency. SpeakDennis solves these challenges by combining:

- **Impromptu Speaking Practice:** An interactive "Impromptu Challenge" mode where users practice speaking based on random topic prompts (choose between one word, two words, or a full sentence) along with a dice-roll mechanic that determines the speaking duration. This builds quick-thinking and improvisation skills.
- **Conversational AI Interview Mode:** A mock interview environment featuring a conversational AI. It uses the Speechify API to provide high-quality text-to-speech audio, alongside a character-based chat UI that displays meeting transcripts so users can review and evaluate their performance.

## What I Learned

Building this project provided extensive hands-on experience across multiple domains:

- **API Integration & Text-to-Speech:** Integrating the Speechify API to generate natural, high-quality audio for the AI interviewer.
- **Modern Frontend Architecture:** Utilizing Next.js, React, TypeScript, and Tailwind CSS to create a premium, modular user interface.
- **State Management:** Leveraging Redux Toolkit to manage complex UI states, such as tracking the conversation history in the interview mode.
- **Dynamic UI/UX:** Implementing interactive features like the randomized dice roll and dynamically generating character-based chat bubbles for interview transcripts.

## Future Features

The roadmap for SpeakDennis includes:

- **Advanced Performance Analytics:** Implementing AI-driven analysis of interview transcripts to detect filler words, measure speaking pace, and perform sentiment analysis.
- **Expanded AI Personas:** Adding more diverse and customizable AI interviewer personas tailored for specific industries or roles.
- **User Authentication:** Implementing full user accounts to save practice history and track progress over time.

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
