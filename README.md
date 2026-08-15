# NIVARA

A holistic student-success platform designed to bridge the gap between academic performance and student well-being.

Nivara is a modern Next.js web application focused on a polished, responsive, premium UI/UX experience. The project includes dashboard, academics, check-in, insights, counsellors, resources, profile, settings, and support experiences.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Radix UI
- Lucide React
- Recharts
- React Hook Form
- Zod

---

# 🚀 Run Nivara Locally

### Requirements

Install:

- **Node.js 18.17+**
- npm (included with Node.js)

Bun is also supported because the project includes a `bun.lock` file.

You do **not** need to install any database, backend, or AI service just to open the current frontend locally unless the project is later configured to require one.

### 1. Extract the ZIP

Extract the downloaded GitHub ZIP to a normal folder.

Example:

```text
C:\Projects\nivara
```

Open a terminal **inside the folder that contains `package.json`**.

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### 3. Start the development server

Using npm:

```bash
npm run dev
```

Or using Bun:

```bash
bun run dev
```

### 4. Open the website

After the server starts, open:

**http://localhost:3000**

Keep the terminal running while using the site.

To stop the development server, press:

```text
Ctrl + C
```

---

# 🤖 Instructions for AI Coding Agents

If a user gives you a downloaded ZIP of this repository and asks:

> "How do I run this locally?"

Guide them in the simplest possible way.

### Follow this order

1. Find the folder containing `package.json`.
2. Check `package.json` to identify the project and available scripts.
3. Confirm that Node.js is installed by asking the user to run:

```bash
node -v
```

4. If Node.js is missing, tell the user to install Node.js 18.17 or newer.
5. Install the dependencies:

```bash
npm install
```

6. Start the development server:

```bash
npm run dev
```

7. Tell the user to open:

```text
http://localhost:3000
```

### Keep the explanation simple

Do **not** ask the user to manually configure a database, create a production build, deploy to Vercel, or edit source files unless an actual error requires it.

Do **not** tell the user to run `git init`, `git clone`, or `git push` just to run the downloaded ZIP locally.

The user's goal is simply:

```text
ZIP → extract → open terminal → npm install → npm run dev → open localhost:3000
```

### If `npm run dev` fails

First ask the user to copy the **full terminal error**.

Then:

1. Check whether they are in the folder containing `package.json`.
2. Check `node -v`.
3. Check whether dependencies were installed successfully.
4. Inspect the project's `package.json` and configuration before suggesting changes.
5. Give the smallest fix necessary.

Do not rewrite or restructure the project unless the error actually requires it.

### If the user asks for a production build

Use:

```bash
npm run build
```

Then:

```bash
npm run start
```

The production server will be available at:

```text
http://localhost:3000
```

---

# ⚙️ Environment Variables

The repository includes:

```text
.env.example
```

Current example variables:

```text
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_MOCK_LATENCY_MS=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=
```

For a normal frontend run, first try:

```bash
npm install
npm run dev
```

Only create `.env.local` if the application or an error specifically requires environment variables.

Never expose real API keys, tokens, passwords, or other secrets in a public GitHub repository.

---

# 📁 Main Project Structure

```text
app/
├── academics/
├── check-in/
├── counsellors/
├── dashboard/
├── insights/
├── profile/
├── resources/
├── settings/
├── support/
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── dashboard/
├── layout/
├── shared/
└── ui/

lib/
└── data/
```

The `app/` directory contains the main Next.js routes.

The `components/` directory contains reusable UI and layout components.

The `lib/` directory contains shared data and types.

---

# 🛠 Useful Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

---

# 📌 Quick Start

For most users, these are the only commands needed:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Nivara

Built as a modern student-success experience with a strong emphasis on thoughtful UI/UX, responsive design, reusable components, and smooth interaction.
