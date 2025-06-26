# Company Frontend Technical Challenge

This is a React + TypeScript application built with Vite, created to complete the frontend technical challenge for Company.

## 🛠️ Stack

- Vite + React + TypeScript
- Cypress for e2e testing
- Jest + React Testing Library for unit testing
- ESLint + Prettier + Husky + Commitlint
- TailwindCSS + ShadCN UI
- Zustand with persist
- React Router v6 with lazy loading
- Tanstack Query for data fetching
- React Hook Form for form handling

---

## 📦 Project Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd your-project-folder
```

### 2. Install dependencies

```bash
pnpm install
```

---

## 🧹 Code Quality

### Setup Prettier, ESLint, Husky, Commitlint

```bash
pnpm dlx @antfu/ni
pnpm install -D eslint prettier eslint-config-prettier lint-staged husky @commitlint/{cli,config-conventional}
npx husky install
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

### Add the following to `package.json`:

```json
"lint-staged": {
  "**/*.{ts,tsx,js,jsx}": "eslint --fix",
  "**/*.{ts,tsx,js,jsx,json,css,md}": "prettier --write"
}
```

---

## 🎨 UI + Theme

### Install Tailwind + ShadCN UI

```bash
pnpm dlx shadcn-ui@latest init
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.ts` and `shadcn-ui.config.ts` accordingly.

Implement base theme switcher and persist theme with `localStorage`.

---

## ✅ Testing Setup

```bash
pnpm install -D jest @testing-library/react @testing-library/jest-dom cypress
```

- Configure Jest for unit tests
- Configure Cypress for e2e tests
- Add test scripts to `package.json`

---

## 🚀 Start the Dev Server

```bash
pnpm run dev
```

## 🐳 Docker

Build and serve app via Docker (to be configured at the end).

---

## 📂 Project Structure

```
src/
├── components/
├── pages/
├── hooks/
├── store/
├── theme/
├── tests/
├── App.tsx
├── main.tsx
```

---

## ✨ Final Notes

- Ensure multiple meaningful commits throughout the project.
- Do NOT include any reference to "1Global" in repo description or code.
