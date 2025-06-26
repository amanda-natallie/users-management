# Routing System Documentation

This project implements a complete routing system using React Router v7 with authentication protection.

## Features

### 🔐 Authentication System

- **Public Route**: `/auth` - Login page accessible to everyone
- **Protected Route**: `/dashboard` - Only accessible to authenticated users
- **Authentication Guard**: Middleware that checks localStorage for user authentication
- **Automatic Redirects**: Unauthenticated users are redirected to `/auth`

### 📱 Lazy Loading

- Both `AuthPage` and `DashboardPage` are lazy-loaded for better performance
- Fullscreen loader with spinner shows during page loading

### 🎨 UI Components

- **FullscreenLoader**: Shows during lazy loading with customizable message
- **NotFound**: 404 page with Lucide icon and navigation back to dashboard
- **AuthGuard**: Middleware component for route protection

## How to Test

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Authentication Flow

1. **Visit `/auth`** - You'll see the login form
2. **Enter any email and password** - Click login
3. **You'll be redirected to `/dashboard`** - Protected route
4. **Try accessing `/dashboard` directly** - If not logged in, you'll be redirected to `/auth`

### 3. Test Logout

1. **Click the "Logout" button** on the dashboard
2. **You'll be redirected to `/auth`**
3. **Try accessing `/dashboard` again** - You'll be redirected back to `/auth`

### 4. Test 404 Page

1. **Visit any non-existent route** (e.g., `/random-page`)
2. **You'll see the 404 page** with option to go back to dashboard

## File Structure

```
src/
├── components/
│   ├── ui/
│   │   └── loader.tsx          # Fullscreen loader component
│   ├── auth-guard.tsx          # Authentication middleware
│   └── not-found.tsx           # 404 page component
├── pages/
│   ├── auth/
│   │   └── auth.tsx            # Login page
│   └── dashboard/
│       └── dashboard.tsx       # Protected dashboard page
└── App.tsx                     # Main routing configuration
```

## Authentication Storage

The authentication state is stored in `localStorage` with the key `user`. The stored object contains:

```json
{
  "email": "user@example.com",
  "id": 1234567890
}
```

## Route Configuration

- `/` → Redirects to `/dashboard` (protected)
- `/auth` → Public login page
- `/dashboard` → Protected dashboard page
- `*` → 404 Not Found page

## Security Notes

- This is a simple implementation using localStorage
- In production, you should implement proper JWT tokens and secure authentication
- The AuthGuard component can be extended to handle token expiration and refresh
