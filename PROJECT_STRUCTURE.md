# Project Structure Documentation

## 📁 Folder Organization

### Root Directory
- **Configuration Files**: Build tools, linting, and project settings
- **Documentation**: README and project structure files
- **Source Code**: Main application code in `src/` directory

### `/src` - Main Source Code
```
src/
├── components/     # Reusable React components
├── hooks/         # Custom React hooks
├── services/      # Business logic and API services
├── utils/         # Utility functions and constants
├── assets/        # Static assets (images, icons)
├── App.jsx        # Main application component
├── App.css        # Application-specific styles
├── firebase.js    # Firebase configuration
├── index.css      # Global styles
└── main.jsx       # Application entry point
```

### `/public` - Static Assets
- **Static files** served directly by the web server
- **Favicon, robots.txt, manifest.json** (when added)
- **Images and other assets** that don't need processing

### Generated Directories
- **`/dist`** - Production build output (auto-generated)
- **`/node_modules`** - Dependencies (auto-generated)

## 🏗️ Architecture Overview

### Component Structure
- **App.jsx**: Main application container
- **components/**: Reusable UI components
  - `Login.jsx`: Authentication login form
  - `Signup.jsx`: User registration form

### Service Layer
- **services/analysisService.js**: TOS analysis business logic
- **firebase.js**: Firebase configuration and setup

### Custom Hooks
- **hooks/useAuth.js**: Authentication state management

### Utilities
- **utils/constants.js**: Application constants and messages

## 🔧 Configuration Files

### Build Configuration
- **vite.config.js**: Vite build tool configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **postcss.config.js**: PostCSS processing configuration

### Code Quality
- **eslint.config.js**: ESLint linting rules
- **.gitignore**: Git ignore patterns

### Dependencies
- **package.json**: Project dependencies and scripts
- **package-lock.json**: Locked dependency versions

## 🚀 Development Workflow

1. **Development**: `npm run dev` - Start development server
2. **Building**: `npm run build` - Create production build
3. **Linting**: `npm run lint` - Check code quality
4. **Preview**: `npm run preview` - Preview production build

## 📦 Key Dependencies

### Core Framework
- **React 19**: UI framework
- **Vite**: Build tool and dev server

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

### Authentication & Database
- **Firebase**: Backend services (Auth, Firestore)

### Development Tools
- **ESLint**: Code linting
- **React DevTools**: Development debugging

## 🔄 Data Flow

1. **User Input** → Components
2. **Components** → Services (business logic)
3. **Services** → Firebase (data persistence)
4. **Firebase** → Components (state updates)

## 🎯 Future Enhancements

### Planned Structure Additions
- **`/src/pages/`**: Page-level components
- **`/src/context/`**: React context providers
- **`/src/types/`**: TypeScript type definitions
- **`/src/api/`**: API integration layer
- **`/src/store/`**: State management (Redux/Zustand)

### Additional Services
- **AI Analysis Service**: Integration with AI APIs
- **Web Scraping Service**: TOS content extraction
- **Notification Service**: User alerts and updates
