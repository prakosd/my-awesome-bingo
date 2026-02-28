# 🎉 My Awesome Bingo

> **A social icebreaker bingo game for in-person mixers** — find people who match fun prompts and get 5 in a row to win!

[![Live Demo](https://img.shields.io/badge/▶%20Play%20Live-GitHub%20Pages-brightgreen?style=for-the-badge)](https://prakosd.github.io/my-awesome-bingo/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🕹️ How It Works

1. **Start the game** — a randomised 5×5 bingo card is generated just for you.
2. **Mingle!** — find someone in the room who matches each square's prompt (e.g. *"has a pet"*, *"plays an instrument"*).
3. **Mark it off** — tap a square once you've found your match.
4. **Bingo!** — get 5 in a row (horizontally, vertically, or diagonally) to win 🎊.

The center square is always a **FREE SPACE** — no searching required!

---

## ✨ Features

- 🎲 **Random board** — every player gets a unique card each game.
- 💾 **Auto-save** — your progress is saved in `localStorage` so you can pick up where you left off.
- 📱 **Mobile-friendly** — works great on phones and tablets.
- ⚡ **Instant deploy** — ships to GitHub Pages automatically on every push to `main`.
- 🛠️ **Fully customisable** — swap in your own prompts by editing `src/data/questions.ts`.

---

## 🚀 Quick Start

**Prerequisites:** [Node.js 22+](https://nodejs.org/)

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser and start playing!

---

## 🛠️ Development

```bash
npm run dev      # start dev server with hot-reload
npm run build    # type-check + production build
npm run lint     # ESLint checks
npm run test     # run Vitest test suite
```

---

## 🎨 Customise the Prompts

Edit `src/data/questions.ts` to use your own icebreaker questions:

```ts
export const questions: string[] = [
  "bikes to work",
  "has lived in another country",
  // Add your own…
];
```

Aim for **24 or more** prompts so the board stays fresh across games.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Build | Vite 7 |
| Testing | Vitest 4 + Testing Library |
| Deploy | GitHub Pages (CI/CD) |

---

## 📄 License

[MIT](LICENSE)
