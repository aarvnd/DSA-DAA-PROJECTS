# DSA & DAA Learning Platform

A web app for learning Data Structures & Algorithms (DSA) and Design & Analysis of Algorithms (DAA): read a lesson, look at a visual, then solve practice problems in an in-browser code editor.

**Live:** https://dsa-daa-projects.vercel.app/DSA-DAA-PROJECTS/

## Features

- **23 topics** in two tracks
  - DSA (15): arrays, strings, linked list, stack, queue, recursion, searching, sorting, hashing, trees, heap, trie, graphs, greedy, dynamic programming
  - DAA (8): algorithm analysis, divide and conquer, greedy method, dynamic programming, backtracking, branch and bound, string matching, NP-completeness
- **Lessons** with an introduction, a real-life analogy and sectioned notes
- **Practice problems** per topic, with test cases that run against your code
- **Code editor** (Monaco) with C, C++, Java, Python and JavaScript, plus a free-form Playground
- **Visualizers** for arrays and stacks
- English / Hinglish language toggle and light / dark theme

## Tech stack

React 19 · Vite 7 · React Router 7 · Tailwind CSS 4 · Monaco Editor · react-markdown

## Run locally

Requires Node.js 20.19+ or 22.12+ (Vite 7).

```bash
npm install
npm run dev
```

Open http://localhost:5173/DSA-DAA-PROJECTS/ (the app is served under the `/DSA-DAA-PROJECTS/` base path, set in `vite.config.js` and `src/App.jsx`).

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Running code

Code from the editor is executed by a remote service (`src/services/judge0.js`):

- With `VITE_RAPIDAPI_KEY` set (in a `.env.local` file), it uses **Judge0 CE** through RapidAPI.
- Without a key, it falls back to the public **Piston** API.

```bash
# .env.local
VITE_RAPIDAPI_KEY=your-rapidapi-key
```

## Project structure

```
src/
├── pages/          Home, TopicList, TopicDetail, LessonPage, PracticeList, ProblemPage, Playground, About
├── components/     layout, editor (Monaco + toolbar + output), visualizer, common UI
├── services/       judge0.js (code execution)
├── hooks/          language, theme, localStorage
└── data/
    ├── topics.json           list of tracks and topics
    ├── dsa/<topic>/          notes.json + problems.json
    └── daa/<topic>/          notes.json + problems.json
```

## Adding a topic

1. Add the topic to its track in `src/data/topics.json`.
2. Create `src/data/<dsa|daa>/<topic-id>/notes.json` (`topicId`, `title`, `introduction`, `realLifeAnalogy`, `sections`).
3. Create `problems.json` in the same folder (`topicId`, `problems`).

Lessons and problems are loaded on demand with dynamic imports, so no other code changes are needed.
