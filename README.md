# TOS Trap Detector

A React application that helps detect auto-renewal traps in Terms of Service agreements using AI-powered analysis.

## 🚀 Features

- **User Authentication**: Secure login/signup with Firebase
- **Google Sign-in**: One-click authentication with Google
- **TOS Analysis**: Paste text or provide URLs for analysis
- **AI-Powered Detection**: Identifies auto-renewal traps and hidden clauses
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Results**: Instant analysis feedback

## 📁 Project Structure

```
tos-trap-detector/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── Login.jsx     # Login form component
│   │   └── Signup.jsx    # Signup form component
│   ├── assets/           # Images and static files
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   ├── firebase.js       # Firebase configuration
│   ├── index.css         # Global styles
│   └── main.jsx          # Application entry point
├── dist/                 # Built files (generated)
├── node_modules/         # Dependencies (generated)
├── .gitignore           # Git ignore rules
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Locked dependency versions
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite build configuration
```

## 🛠️ Technology Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Build Tool**: Vite
- **Linting**: ESLint

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/tos-trap-detector.git
cd tos-trap-detector

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore
3. Update `src/firebase.js` with your Firebase config

### Environment Variables
Create a `.env` file for sensitive configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 📱 Usage

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Analyze TOS**: Paste terms of service text or provide a URL
3. **Get Results**: Receive instant analysis of potential traps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
