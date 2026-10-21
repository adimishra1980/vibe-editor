# ⚡ Vibe Editor

> An intelligent, in-browser AI-powered code playground and development environment built with Next.js, WebContainers, Monaco Editor, and local AI (Ollama).

**Vibe Editor** provides a full-stack, browser-based coding experience similar to StackBlitz or CodeSandbox, elevated with an integrated AI Copilot for smart inline completions and an AI coding chat assistant powered completely on your local machine.

---

## ✨ Features

- **🌐 In-Browser Node.js Runtime (WebContainers)**: Execute Node.js environments, install npm packages, and run dev servers directly inside your browser tabs with zero server infrastructure overhead.
- **💻 Monaco Code Editor**: Powered by the same editor engine as VS Code, complete with syntax highlighting, customizable keybindings, multiple tabs, code folding, and auto-indentation.
- **✨ Local AI Inline Suggestions (Copilot-style)**: Real-time, low-latency ghost text code completions powered locally by Ollama. Accept completions seamlessly using `Tab` or trigger manually using `Ctrl + Space`.
- **💬 AI Chat Sidepanel**: Integrated conversational AI assistant capable of:
  - Answering technical questions & explaining complex logic
  - Generating and inserting code directly into active editor files
  - Attaching current open files and cursor context automatically
  - AI Prompt Enhancement to refine and structure your queries
- **📟 Interactive Terminal (Xterm.js)**: Full-featured embedded terminal to inspect build output, execute npm scripts, and monitor development servers.
- **📱 Live Real-Time Preview**: In-app responsive preview window showing your running application with URL bar navigation, refresh, and size toggles.
- **📁 Full File Explorer**: Create, rename, delete, and organize files and nested folders, with persistence across sessions.
- **📦 Starter Templates**: One-click playground creation with pre-configured setups:
  - **React (TypeScript + Vite)**
  - **Next.js (App Router + Shadcn UI)**
  - **Express.js (Node.js REST API)**
  - **Vue 3**
  - **Hono (Node.js)**
  - **Angular**
- **🔐 Authentication**: Seamless OAuth login with GitHub and Google via Auth.js (NextAuth v5).
- **💾 Cloud Persistence**: Save playground states, starred projects, and file modifications in MongoDB via Prisma ORM.

---

## 🧠 AI Architecture: Local Ollama & Model Details

Vibe Editor utilizes **local AI execution** out-of-the-box for high speed, zero API cost, and 100% offline privacy:

- **Default Model**: [`qwen2.5-coder:3b`](https://ollama.com/library/qwen2.5-coder:3b)
  - An optimized code-specialized model capable of fast code completions and multi-turn technical conversations.
  - Runs with minimal RAM/VRAM footprint (~2.5–3 GB), ideal for laptops and consumer hardware.
- **Local Engine**: [Ollama](https://ollama.com/) running on `http://localhost:11434`.
- **Inline Completions API**: Custom prompt engineering with low temperature (`0.1`) and concise token caps (`80 tokens`) to eliminate prefix repetitions and hallucinations.
- **Chat API**: Context-aware coding assistant prompt with file attachment support.

> 💡 **Future Cloud LLM Extension**:
> While currently running on Ollama locally, the API endpoints (`app/api/chat/route.ts` and `app/api/code-suggestion/route.ts`) are structured cleanly so you can easily switch to or add cloud providers (such as OpenAI GPT-4o, Anthropic Claude, Google Gemini, or Groq) by adding your API keys to `.env`.

---

## 📋 Prerequisites

Before running the project, ensure you have installed:

1. **Node.js**: `v18.18.0` or higher (`v20.x` recommended)
2. **npm** / **pnpm** / **yarn**
3. **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
4. **Ollama**: Download and install from [ollama.com](https://ollama.com/)

---

## 🚀 Step-by-Step Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/adimishra1980/vibe-editor.git
cd vibe-editor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup and Run Local AI (Ollama)

1. Make sure the Ollama application is running on your machine.
2. Pull and start the code completion model:

```bash
ollama run qwen2.5-coder:3b
```

3. Confirm Ollama is listening locally by visiting `http://localhost:11434` in your browser (it should display *"Ollama is running"*).

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database (MongoDB connection string)
DATABASE_URL=

# Auth.js / NextAuth Secret (Generate via `npx auth secret` or `openssl rand -hex 32`)
AUTH_SECRET=

# NextAuth URL
NEXTAUTH_URL=

# OAuth Providers
# GitHub (Settings -> Developer Settings -> OAuth Apps)
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Google Cloud Console OAuth 2.0 Credentials
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# (Optional) Cloud AI API Keys for future extension
# OPENAI_API_KEY=""
# ANTHROPIC_API_KEY=""
# GEMINI_API_KEY=""
```

### 5. Generate Prisma Client & Sync Database

```bash
npx prisma generate
npx prisma db push
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Editor Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Tab` | Accept active inline AI ghost-text completion |
| `Escape` | Dismiss active AI completion |
| `Ctrl + Space` / `Cmd + Space` | Trigger manual AI code suggestion |
| `Ctrl + S` / `Cmd + S` | Save current file changes |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) + [React 19](https://react.dev)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **In-Browser Runtime**: [WebContainer API](https://webcontainers.io/)
- **Terminal**: [Xterm.js](https://xtermjs.org/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com), [Shadcn UI](https://ui.shadcn.com), [Lucide Icons](https://lucide.dev)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database & ORM**: [MongoDB](https://www.mongodb.com/) & [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **Local AI Engine**: [Ollama](https://ollama.com/) with `qwen2.5-coder:3b`

---

## 📂 Project Structure

```text
vibe-editor/
├── app/                      # Next.js App Router pages and API routes
│   ├── api/
│   │   ├── chat/             # AI chat endpoint (Ollama integration)
│   │   ├── code-suggestion/  # AI inline ghost-text completion endpoint
│   │   └── template/[id]/    # Template generation and file serving endpoint
│   ├── playground/[id]/      # Core playground IDE workspace
│   └── page.tsx              # Landing / dashboard page
├── modules/
│   ├── ai/                   # AI components (Chat sidepanel, suggestion hooks)
│   ├── playground/           # Editor, file explorer, layout, and preview components
│   └── webContainers/        # WebContainer hooks, terminal, and live preview
├── lib/                      # Database client, template paths, utility helpers
├── prisma/                   # Prisma schema & MongoDB models
├── vibecode-starters/        # Base starter templates (React, Next.js, Express, etc.)
└── public/                   # Static assets
```

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome! Feel free to open an issue or submit a pull request.

---
