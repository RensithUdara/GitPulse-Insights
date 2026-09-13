<p align="center">
  <img src="public/gitpulse-logo.png" alt="GitPulse logo" width="180" />
</p>

<h1 align="center">GitPulse</h1>

<p align="center">
  <strong>Beautiful, customizable GitHub profile analytics cards for README files and portfolios.</strong>
</p>

<p align="center">
  <a href="https://gitpulse-rose.vercel.app"><strong>🚀 Live Demo</strong></a>
  ·
  <a href="#-features">Features</a>
  ·
  <a href="#-quick-start">Quick Start</a>
  ·
  <a href="#-embed-example">Embed</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Deployed-000?style=for-the-badge&logo=vercel" />
</p>

---

## ✨ Overview

**GitPulse** is a GitHub profile card studio that generates elegant, real-time SVG analytics cards from public GitHub data. It is built for developers who want a polished profile README, portfolio, landing page, or dashboard without manually designing stats graphics.

Live app: **https://gitpulse-rose.vercel.app**

---

## 🌟 Features

- 🎨 **Clean card builder** with live preview
- 🌓 **Light, dark, and system UI themes**
- 🧩 **Module controls** for profile, summary, monthly chart, stats, languages, streaks, and activity graph
- 🖼️ **SVG profile card API** ready for GitHub README embeds
- 📋 **Embed panel** with Markdown, HTML, and direct URL tabs
- 🎯 **Multiple card themes** including Ink Dark, Paper Light, Graphite, Copper, Moss, Harbor, Plum, and Stone
- 🚫 **Language filters** to hide noisy languages such as HTML, CSS, notebooks, SCSS, or custom values
- 📈 **GitHub analytics** for contributions, repositories, stars, forks, PRs, issues, streaks, languages, and rank
- ⚡ **Server-side caching** with ETag support for faster repeated requests
- 📦 **Export options** for SVG, PNG, and JPG
- 🚀 **Vercel-ready deployment**

---

## 🛠️ Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **UI:** React, CSS, Lucide React, React Icons
- **Data:** GitHub GraphQL API
- **Hosting:** Vercel
- **Output:** Dynamic SVG cards

---

## 📸 Preview

Generate a card from the live API:

```md
![GitPulse card](https://gitpulse-rose.vercel.app/api/insight?username=mojombo&theme=ink_dark)
```

Example direct URL:

```txt
https://gitpulse-rose.vercel.app/api/insight?username=mojombo&theme=ink_dark
```

---

## 🚀 Quick Start

### 1. Clone the project

```bash
git clone https://github.com/RensithUdara/GitPulse-Insights.git
cd GitPulse-Insights
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Copy the example file:

```bash
cp .env.example .env.local
```

Then add your GitHub token:

```env
GITHUB_TOKEN=your_github_token_here
```

### 4. Run locally

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## 🔑 GitHub Token

GitPulse uses the GitHub GraphQL API, so a personal access token is required.

Create one here:

```txt
https://github.com/settings/tokens
```

Recommended access:

- `read:user`
- Public repository read access

For most public profile cards, a fine-grained token with public user and repository read access is enough.

---

## 🧩 Embed Example

### Markdown

```md
<p align="center">
  <img src="https://gitpulse-rose.vercel.app/api/insight?username=YOUR_USERNAME&theme=ink_dark" alt="YOUR_USERNAME's GitPulse card" />
</p>
```

### HTML

```html
<div align="center">
  <img src="https://gitpulse-rose.vercel.app/api/insight?username=YOUR_USERNAME&theme=ink_dark" alt="YOUR_USERNAME's GitPulse card" />
</div>
```

---

## ⚙️ API Parameters

Base endpoint:

```txt
/api/insight
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `username` | string | required | GitHub username to render |
| `theme` | string | `ink_dark` | Card color theme |
| `profile` | boolean | `true` | Show profile/account section |
| `summary` | boolean | `true` | Show contribution summary |
| `header` | boolean | `true` | Show monthly contribution chart |
| `stats` | boolean | `true` | Show repository and contribution stats |
| `languages` | boolean | `true` | Show most-used languages |
| `streak` | boolean | `true` | Show current and longest streak |
| `graph` | boolean | `true` | Show contribution activity graph |
| `hide_langs` | string | empty | Comma-separated languages to exclude |

Example:

```txt
https://gitpulse-rose.vercel.app/api/insight?username=torvalds&theme=harbor&languages=true&streak=true&graph=false
```

Hide languages:

```txt
https://gitpulse-rose.vercel.app/api/insight?username=YOUR_USERNAME&hide_langs=HTML,CSS,Jupyter%20Notebook
```

---

## 🎨 Available Card Themes

- `ink_dark`
- `paper_light`
- `graphite`
- `copper`
- `moss`
- `harbor`
- `plum`
- `stone`

Legacy theme aliases are also supported, including `dark`, `github_dark`, `github_light`, `radical`, `tokyonight`, `dracula`, `synthwave`, `ocean`, `neo_green`, and more.

---

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production app
npm run start    # Start production server
```

---

## ☁️ Deploy To Vercel

1. Add this project to Vercel.
2. Add `GITHUB_TOKEN` in **Project Settings > Environment Variables**.
3. Deploy the project.

Or use the Vercel CLI:

```bash
vercel deploy --prod
```

Current production URL:

```txt
https://gitpulse-rose.vercel.app
```

---

## 📁 Project Structure

```txt
src/
  app/
    api/insight/route.ts   # SVG API endpoint
    globals.css            # App theme and responsive UI styles
    layout.tsx             # Metadata and app shell setup
    page.tsx               # GitPulse card builder UI
  lib/
    card-generator.ts      # SVG card renderer
    github.ts              # GitHub GraphQL data fetching and caching
    svg-utils.ts           # SVG helpers and icons
    themes.ts              # Card theme definitions
  types/
    github.ts              # Shared GitHub data types
public/
  gitpulse-logo.png        # GitPulse brand logo
```

---

## 💡 Use Cases

- GitHub profile README stats card
- Developer portfolio profile badge
- Open-source project author card
- Personal website analytics widget
- Shareable GitHub activity snapshot

---

## 🤝 Contributing

Contributions are welcome. You can improve the UI, add new card themes, refine analytics, optimize SVG rendering, or add more export options.

Suggested workflow:

```bash
git checkout -b feature/your-feature
npm run build
git commit -m "Add your feature"
```

---

## 📄 License

This project is open source. Check the repository license file for details.

---

<p align="center">
  Built with ❤️ for developers who want their GitHub profile to feel alive.
</p>
