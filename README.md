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

## 🐳 Docker Setup

This project is configured to run with Docker and Colima. The setup includes multi-stage builds for both development and production environments.

### Prerequisites

- Docker
- Colima (for macOS users)
- Make (optional, for using Makefile commands)

### Quick Start with Docker

#### Using Makefile (Recommended)

```bash
# Start Colima (if not running)
make colima-start

# Start development environment
make dev

# Start production environment
make prod

# Build images
make build

# Clean up
make clean
```

#### Using Docker Compose directly

```bash
# Development
docker-compose up app-dev

# Production
docker-compose -f docker-compose.prod.yml up

# Build and start
docker-compose up --build app-dev
```

### Docker Commands

#### Development

```bash
# Start development server with hot reload
docker-compose up app-dev

# Start in background
docker-compose up -d app-dev

# Access shell in container
docker-compose exec app-dev sh

# View logs
docker-compose logs -f app-dev
```

#### Production

```bash
# Start production server
docker-compose -f docker-compose.prod.yml up

# Start in background
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Building Images

```bash
# Build all images
docker-compose build

# Build specific target
docker build --target dev -t user-backoffice:dev .
docker build --target production -t user-backoffice:prod .
```

### Environment Variables

The application supports the following environment variables:

#### Required Variables
- `VITE_API_URL`: ReqRes API base URL (default: `https://reqres.in/api`)
- `VITE_API_KEY`: ReqRes API key for authentication

#### Optional Variables
- `NODE_ENV`: Set to `development` or `production`
- `VITE_APP_NAME`: Application name (default: `User Backoffice`)
- `VITE_APP_VERSION`: Application version (default: `1.0.0`)
- `VITE_ENABLE_DEBUG`: Enable debug mode (default: `true` in dev, `false` in prod)
- `VITE_ENABLE_ANALYTICS`: Enable analytics (default: `false` in dev, `true` in prod)

#### Environment Files
- `.env.example`: Template with all available variables (safe to commit)
- `.env.development`: Development environment configuration (NOT committed)
- `.env.production`: Production environment configuration (NOT committed)

#### Local Development Setup
```bash
# Setup environment files (creates .env.development and .env.production)
make env-setup

# Or manually:
cp .env.example .env.development
cp .env.example .env.production

# Edit with your actual values
# VITE_API_KEY=your-actual-reqres-api-key
```

#### Security Notes
- ⚠️ **Never commit `.env.development` or `.env.production` to git**
- ✅ `.env.example` is safe to commit (contains no real secrets)
- 🔒 Docker will use the `.env` files from your local machine
- 🚀 For production deployment, use your CI/CD secrets management

#### Docker Environment
The Docker setup automatically uses the appropriate environment files:
- Development: Uses `.env.development`
- Production: Uses `.env.production`

### Health Checks

- Development: `http://localhost:5173`
- Production: `http://localhost:8080/health`

### Colima Integration

Since you're using Colima, here are some useful commands:

```bash
# Check Colima status
make colima-status

# Start Colima
make colima-start

# Stop Colima
make colima-stop
```

### Testing with Docker

```bash
# Run unit tests
make test

# Run e2e tests
make test-e2e

# Or directly with docker-compose
docker-compose exec app-dev pnpm test
docker-compose exec app-dev pnpm test:e2e
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
