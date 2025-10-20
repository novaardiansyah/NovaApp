# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## NovaApp - React Native Finance Management Application

NovaApp is a production-ready React Native finance management application built with Expo and TypeScript, featuring comprehensive authentication flows with Laravel Sanctum API integration and Material Design UI.

## Development Commands

```bash
npm start              # Start Expo development server with tunnel
npm run start:clean    # Start with cache clearing
npm run android        # Start on Android
npm run ios            # Start on iOS
npm run web            # Start on web
npm run build:preview  # EAS build for preview deployment
```

**Important**: Never run the project (npm start, npm run android, etc.). The user will run the project manually. Focus only on code changes and static analysis.

## Architecture Overview

### Three-Layer Navigation System
1. **RootNavigator** - Entry point that checks authentication state via `useAuth()` hook and routes to AuthNavigator or AppNavigator
2. **AuthNavigator** - Stack navigator for authentication screens (Login, Signup, Forgot Password, OTP, Reset Password)
3. **AppNavigator** - Bottom tab navigation with 4 main sections (Home, Budget, Reports, Profile), each with nested stack navigators

### Authentication Flow
- **AuthContext** (`contexts/AuthContext.tsx`) provides global authentication state management
- Token-based authentication with Laravel Sanctum API
- Persistent storage using AsyncStorage
- Auto-login functionality with silent token validation
- User profile management with financial data fetching

### State Management
- Single `AuthContext` for all authentication state (user, token, loading, isAuthenticated)
- Provider pattern at App.tsx level
- Custom `useAuth()` hook for clean usage
- Persistent storage integration with AsyncStorage

## Key Development Patterns

### Code Organization
- **Tab Size**: Always use 2 spaces for indentation (strictly enforced)
- **Component Structure**: Functional components with TypeScript interfaces
- **Path Aliases**: Use `@/*` imports (configured in tsconfig.json)
- **File Naming**: PascalCase for components, camelCase for utilities

### API Integration
- Centralized config in `config/app.ts`
- Environment-based configuration with `APP_CONFIG`
- Consistent header structure and error handling
- Bearer token authentication with automatic token inclusion

### Critical API Base URL Rule
**The `APP_CONFIG.API_BASE_URL` already includes `/api` prefix. Never add `/api` manually to API endpoints.**

**Correct:**
- `${APP_CONFIG.API_BASE_URL}/auth/login` ✓
- `${APP_CONFIG.API_BASE_URL}/payments` ✓

**Incorrect:**
- `${APP_CONFIG.API_BASE_URL}/api/auth/login` ❌
- `${APP_CONFIG.API_BASE_URL}/api/payments` ❌

### UI/UX Patterns
- Material Design 3 components via React Native Paper
- Theme-based color system from `constants/colors.ts`
- Safe area insets support throughout
- Loading states with skeleton loaders
- Form validation with real-time feedback
- Pull-to-refresh functionality for data screens

## Key Files to Understand

- `App.tsx` - Root component with AuthProvider and navigation setup
- `contexts/AuthContext.tsx` - Global authentication state management
- `navigation/RootNavigator.tsx` - Conditional routing based on auth state
- `config/app.ts` - Environment configuration and API setup
- `screens/HomeScreen.tsx` - Main financial dashboard
- `screens/LoginScreen.tsx` - Authentication interface

## Project Structure Highlights

```
NovaApp/
├── components/       # Reusable UI components (FormInput, AppHeader, etc.)
├── contexts/         # React contexts (AuthContext.tsx)
├── navigation/       # Navigation setup with multiple navigators
├── screens/          # All application screens (22+ screens)
├── styles/           # Modular styling system with common styles
├── constants/        # App constants and color themes
├── config/           # Environment configuration
└── assets/           # Static assets (icons, images, etc.)
```

## Tech Stack

- **React Native 0.81.4** - Cross-platform mobile development
- **Expo ~54.0.10** - Development platform and SDK
- **TypeScript ~5.9.2** - Type-safe JavaScript with strict mode
- **React Navigation v7.x** - Navigation system
- **React Native Paper 5.14.5** - Material Design components
- **AsyncStorage 2.2.0** - Persistent data storage

## Development Protocol

- Maintain 2-space indentation consistently
- Use TypeScript for type safety
- Follow React Native best practices
- Keep code clean, consistent, and properly indented
- Focus on code changes and static analysis only
- Use conventional commit format when requested: "feat: description", "fix: description", etc.