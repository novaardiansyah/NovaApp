# NovaApp - React Native Finance Management App

## Project Overview
NovaApp is a modern React Native finance management application built with Expo and TypeScript. It features a complete authentication flow with Laravel Sanctum API integration, Material Design UI, and robust user management.

## Tech Stack
- **React Native** (v0.81.4) - Cross-platform mobile development
- **Expo** (~54.0.9) - Development platform and SDK
- **TypeScript** (~5.9.2) - Type-safe JavaScript
- **React Navigation** (v7.x) - Routing and navigation
- **React Native Paper** (v5.14.5) - Material Design components
- **AsyncStorage** (v2.2.0) - Persistent data storage
- **Vector Icons** (v10.3.0) - Icon library

## Key Features
- 🔐 Authentication system with Laravel Sanctum
- 🏠 Home screen with financial dashboard
- 👤 User profile management
- 📱 Bottom tab navigation
- 🎨 Material Design 3 UI
- 💾 Persistent session management
- 🔄 Pull-to-refresh functionality
- 📊 Sample financial data display

## Project Structure
```
NovaApp/
├── components/         # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── navigation/         # Navigation setup
├── screens/            # App screens
├── constants/          # App constants and colors
└── config/             # Environment configuration
```

## Navigation Architecture
- **RootNavigator**: Conditional routing based on authentication state
- **AuthNavigator**: Login, Signup, Forgot Password flows
- **AppNavigator**: Home and Profile tabs with bottom navigation

## Authentication Flow
- Uses Laravel Sanctum for API authentication
- Token-based authentication with AsyncStorage
- Persistent session management
- Auto-login functionality
- User data fetching with authentication headers

## Key Files to Understand
- `App.tsx` - Main app component with AuthProvider
- `contexts/AuthContext.tsx` - Global authentication state management
- `navigation/RootNavigator.tsx` - Conditional navigation logic
- `screens/HomeScreen.tsx` - Main dashboard with financial overview
- `screens/LoginScreen.tsx` - Authentication interface

## Development Commands
```bash
npm start          # Start Expo development server
npm run android    # Start on Android
npm run ios        # Start on iOS
npm run web        # Start on web
```

## API Integration
- Backend API integration with Laravel Sanctum
- Environment configuration in `config/environment.ts`
- Authentication headers management
- Error handling for API requests

## UI/UX Features
- Material Design 3 components
- Responsive layouts
- Loading states and error handling
- Currency formatting (IDR)
- Card-based interface design
- Pull-to-refresh functionality

## State Management
- React Context API for global state
- AsyncStorage for persistent data
- Local state management with useState hooks
- Authentication state management

## Code Style & Formatting
- **Tab Size**: Always use 2 spaces for indentation
- **Code Formatting**: Keep code clean, consistent, and properly indented
- **TypeScript**: Standard TypeScript formatting and conventions
- **React Native**: Follow React Native best practices
- **Consistency**: Maintain consistent formatting across all files

## Testing & Quality
- TypeScript for type safety
- Component-based architecture
- Clean separation of concerns
- Reusable UI components

## Commit Messages
When requested to provide commit messages, I will always generate a comprehensive commit message that you can use for manual commits. The message will include:
- Summary of changes made
- Key files modified
- Feature additions and improvements
- Bug fixes and optimizations
- Proper formatting with conventional commit format
- Claude Code attribution as required

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>