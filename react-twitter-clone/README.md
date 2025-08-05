# React Twitter Clone

A modern, responsive Twitter clone built with React.js, Tailwind CSS, and Framer Motion. This application connects to a Node.js backend API to provide full Twitter-like functionality.

## Features

### 🔐 Authentication
- User registration with validation
- Secure login/logout
- JWT token-based authentication
- Password strength indicators

### 🐦 Core Twitter Features
- Create, read, and delete tweets
- Real-time tweet feed
- User profiles with tweet history
- Following/followers system
- Tweet interactions (likes, replies, retweets)

### 🎨 Modern UI/UX
- Clean, minimalist design inspired by Twitter/X
- Dark/light mode toggle
- Smooth animations with Framer Motion
- Responsive design for all screen sizes
- Hover effects and micro-interactions

### 🚀 Performance
- Optimized API calls
- Smooth scrolling and transitions
- Loading states and error handling
- Mobile-first responsive design

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on `http://localhost:3000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-twitter-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Backend Setup
Make sure your backend API is running on `http://localhost:3000`. The backend should provide the following endpoints:

- `POST /register/` - User registration
- `POST /login/` - User login
- `GET /profile/` - Get user profile
- `GET /user/tweets/feed/` - Get tweet feed
- `GET /user/tweets/` - Get user's tweets
- `POST /user/tweets/` - Create new tweet
- `DELETE /tweets/:id/` - Delete tweet
- `GET /user/following/` - Get following list
- `GET /user/followers/` - Get followers list

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── RightSidebar.jsx
│   ├── Tweet/
│   │   ├── TweetCard.jsx
│   │   └── TweetCompose.jsx
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── Home.jsx
│   └── Profile.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Key Features Explained

### Authentication System
- Context-based state management for user authentication
- Automatic token refresh and logout on expiration
- Protected routes that redirect to login when needed

### Tweet Management
- Compose tweets with character counter
- Real-time feed updates
- Delete functionality for own tweets
- Responsive tweet cards with hover effects

### Theme System
- Dark/light mode toggle
- System preference detection
- Persistent theme storage

### Responsive Design
- Mobile-first approach
- Floating compose button on mobile
- Collapsible sidebars
- Touch-friendly interactions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The app integrates with your existing backend API through the `services/api.js` file. All API calls include:

- Automatic JWT token attachment
- Error handling and token refresh
- Request/response interceptors
- Centralized API configuration

## Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`. You can modify the Twitter-specific colors:

```javascript
colors: {
  twitter: {
    blue: '#1DA1F2',
    darkBlue: '#1A91DA',
    // ... other colors
  }
}
```

### Animations
Animations are handled by Framer Motion. You can customize them in individual components or add new ones using the motion components.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspired by Twitter/X
- Icons by Lucide React
- Animations by Framer Motion
- Styling by Tailwind CSS