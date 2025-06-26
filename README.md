# User Backoffice Code Challenge

This is a React + TypeScript application built with Vite, created to complete the frontend technical challenge.

## 🛠️ Stack

- Vite + React + TypeScript
- Cypress for e2e testing
- Jest + React Testing Library for unit testing
- ESLint + Prettier + Husky + Commitlint
- TailwindCSS + ShadCN UI (to be configured)
- Zustand with persist (to be configured)
- React Router v6 with lazy loading (to be configured)
- Tanstack Query for data fetching (to be configured)
- React Hook Form for form handling (to be configured)

## 📦 Project Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the development server

```bash
pnpm dev
```

## 🧪 Testing

### Unit Tests (Jest + RTL)

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests in CI mode
pnpm test:ci
```

### E2E Tests (Cypress)

Before running e2e tests, make sure the development server is running:

```bash
# Start the dev server
pnpm dev

# In another terminal, run e2e tests
pnpm test:e2e
```

#### Cypress Commands

```bash
# Open Cypress Test Runner (interactive mode)
pnpm test:e2e:open

# Run tests in headless mode
pnpm test:e2e

# Alternative commands
pnpm cypress:open
pnpm cypress:run
```

For more information about Cypress tests, see [cypress/README.md](./cypress/README.md).

## 🧹 Code Quality

```bash
# Lint code
pnpm lint

# Format code (if prettier is configured)
pnpm format
```

## 🚀 Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📂 Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── store/         # State management
├── theme/         # Theme configuration
├── tests/         # Unit tests
├── App.tsx        # Main App component
└── main.tsx       # Entry point

cypress/
├── e2e/           # E2E test files
├── fixtures/      # Test data
├── support/       # Support files and custom commands
└── tsconfig.json  # TypeScript config for Cypress
```

## 📚 Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [Cypress E2E Tests](./cypress/README.md)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
