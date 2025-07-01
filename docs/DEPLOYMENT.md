# 🚀 Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the User Management System across different environments, from local development to production. The application supports multiple deployment strategies including Docker containers, static hosting, and cloud platforms.

## Deployment Strategies

### 1. Docker Deployment (Recommended)

The application is optimized for containerized deployment with multi-stage builds for both development and production environments.

#### Prerequisites

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Make** (optional, for simplified commands)

#### Quick Deployment

```bash
# Clone and setup
git clone <repository-url>
cd users-management

# Setup environment
make env-setup

# Deploy with Docker
make prod
```

#### Manual Docker Deployment

```bash
# Build production image
docker build --target production -t user-management:latest .

# Run production container
docker run -d \
  --name user-management \
  -p 8080:80 \
  -e VITE_API_URL=https://reqres.in/api \
  user-management:latest
```

### 2. Static Hosting Deployment

For platforms like Vercel, Netlify, or GitHub Pages.

#### Build for Production

```bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# The built files will be in the `dist/` directory
```

#### Environment Configuration

Create environment variables in your hosting platform:

```env
VITE_API_URL=https://reqres.in/api
VITE_API_KEY=your-api-key
VITE_APP_NAME=User Management System
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

## Environment Configurations

### Development Environment

```env
# .env.development
VITE_API_URL=https://reqres.in/api
VITE_API_KEY=dev-api-key
VITE_APP_NAME=User Management System (Dev)
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
NODE_ENV=development
```

### Production Environment

```env
# .env.production
VITE_API_URL=https://reqres.in/api
VITE_API_KEY=prod-api-key
VITE_APP_NAME=User Management System
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
NODE_ENV=production
```

### Staging Environment

```env
# .env.staging
VITE_API_URL=https://reqres.in/api
VITE_API_KEY=staging-api-key
VITE_APP_NAME=User Management System (Staging)
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
NODE_ENV=staging
```

## Docker Configuration

### Multi-Stage Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm build

# Production image, copy all the files and run the app
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy built assets
COPY --from=builder /app/dist .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Configuration

#### Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  app-dev:
    build:
      context: .
      target: dev
    ports:
      - '5173:5173'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    env_file:
      - .env.development
    command: pnpm dev
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:5173']
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app-prod:
    build:
      context: .
      target: production
    ports:
      - '8080:80'
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost/health']
      interval: 30s
      timeout: 10s
      retries: 3
```

## Cloud Platform Deployments

### Vercel Deployment

#### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### 2. Environment Variables

Set in Vercel dashboard:

```env
VITE_API_URL=https://reqres.in/api
VITE_API_KEY=your-api-key
VITE_APP_NAME=User Management System
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=true
```

#### 3. Build Configuration

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify Deployment

#### 1. Build Settings

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Environment Variables

Set in Netlify dashboard:

```env
VITE_API_URL=https://reqres.in/api
VITE_API_KEY=your-api-key
VITE_APP_NAME=User Management System
```

### AWS S3 + CloudFront

#### 1. Build and Upload

```bash
# Build the application
pnpm build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### 2. S3 Bucket Configuration

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:ci
      - run: pnpm test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            your-registry/user-management:latest
            your-registry/user-management:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to production
        run: |
          # Deploy to your infrastructure
          echo "Deploying to production..."
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18-alpine
  script:
    - pnpm install
    - pnpm test:ci
    - pnpm test:e2e

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t user-management:$CI_COMMIT_SHA .
    - docker push user-management:$CI_COMMIT_SHA

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying to production..."
  only:
    - main
```

## Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-avatar'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security
        location ~ /\. {
            deny all;
        }
    }
}
```

## Monitoring and Health Checks

### Health Check Endpoint

```typescript
// Add to your application
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.VITE_APP_VERSION,
    environment: process.env.NODE_ENV,
  });
});
```

### Docker Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1
```

### Monitoring Setup

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - '9090:9090'
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - '3000:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

## Security Considerations

### Environment Variables

- **Never commit sensitive data** to version control
- **Use secrets management** in production
- **Rotate API keys** regularly
- **Validate environment variables** at startup

### Container Security

```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

### Network Security

```yaml
# docker-compose.secure.yml
services:
  app:
    # ... other config
    networks:
      - internal
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/cache/nginx

networks:
  internal:
    driver: bridge
    internal: true
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

#### 2. Docker Issues

```bash
# Clean Docker environment
docker system prune -a
docker volume prune

# Rebuild without cache
docker build --no-cache -t user-management .
```

#### 3. Environment Variables

```bash
# Validate environment
pnpm validate-env

# Check environment in container
docker exec -it container-name env
```

### Debug Commands

```bash
# Check application logs
docker logs user-management

# Access container shell
docker exec -it user-management sh

# Check network connectivity
docker exec user-management curl -f http://localhost/health

# Monitor resource usage
docker stats user-management
```

## Rollback Strategy

### Docker Rollback

```bash
# Tag current version
docker tag user-management:latest user-management:backup

# Rollback to previous version
docker tag user-management:previous user-management:latest

# Restart container
docker-compose restart app-prod
```

### Database Rollback

```bash
# Backup current data
docker exec db pg_dump -U user database > backup.sql

# Restore from backup
docker exec -i db psql -U user database < backup.sql
```

---

This deployment guide provides comprehensive instructions for deploying the User Management System across various environments and platforms, ensuring reliable and secure deployments.
