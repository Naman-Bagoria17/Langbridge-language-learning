# LangBridge - Language Learning Chat Platform

LangBridge is a social platform that connects language learners with each other through friend requests, real-time chat, and video calls. Built with React, Node.js, and Stream.io for communication.

## Features

- 👥 **Friend System**: Send and accept friend requests to connect with other users
- 💬 **Real-time Chat**: Message your friends using Stream Chat
- 📹 **Video Calls**: Start video calls with friends through chat links
- 🎯 **User Recommendations**: Browse and discover other language learners
- 👤 **User Profiles**: Create profiles with your native and learning languages
- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 📱 **Responsive Design**: Clean UI with Tailwind CSS and DaisyUI

## Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Stream Chat React** - Chat UI components
- **Stream Video React SDK** - Video calling components
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Stream Chat** - Chat backend service
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Parse HTTP cookies
- **dotenv** - Environment variable management

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Stream.io Account** (for chat and video features)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Fluento-Project
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd BACKEND
npm install

# Install frontend dependencies
cd ../FRONTEND
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
Create a `.env` file in the `BACKEND` directory:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/fluento

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here_change_this_in_production

# Stream API Configuration (Get these from https://getstream.io/)
STEAM_API_KEY=your_stream_api_key_here
STEAM_API_SECRET=your_stream_api_secret_here
```

#### Frontend Environment (.env)
Create a `.env` file in the `FRONTEND` directory:
```env
# Vite Environment Variables
VITE_STREAM_API_KEY=your_stream_api_key_here

# Development Configuration
VITE_API_BASE_URL=http://localhost:5001/api
```

### 4. Stream.io Setup

1. Go to [Stream.io](https://getstream.io/) and create a free account
2. Create a new app in your Stream dashboard
3. Copy your API Key and API Secret
4. Add them to your environment files (both backend and frontend need the API Key)

### 5. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the default connection string: `mongodb://localhost:27017/langbridge`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the `MONGO_URI` in your backend `.env` file

## Running the Application

### Development Mode

#### Start Backend Server
```bash
cd BACKEND
npm run dev
```
The backend will run on `http://localhost:5001`

#### Start Frontend Development Server
```bash
cd FRONTEND
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Mode

#### Build and Start
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Project Structure

```
Fluento-Project/
├── BACKEND/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── lib/             # Utility libraries
│   │   └── server.js        # Express server setup
│   ├── .env                 # Backend environment variables
│   ├── .env.example         # Environment template
│   └── package.json         # Backend dependencies
├── FRONTEND/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── store/           # Zustand stores
│   │   └── constants/       # App constants
│   ├── .env                 # Frontend environment variables
│   ├── .env.example         # Environment template
│   └── package.json         # Frontend dependencies
├── .gitignore               # Git ignore rules
├── package.json             # Root package.json
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/onboarding` - Complete user onboarding

### Users
- `GET /api/users` - Get recommended users
- `GET /api/users/friends` - Get user's friends
- `POST /api/users/friend-request/:id` - Send friend request
- `PUT /api/users/friend-request/:id/accept` - Accept friend request
- `GET /api/users/friend-requests` - Get incoming friend requests
- `GET /api/users/outgoing-friend-requests` - Get outgoing friend requests

### Chat
- `GET /api/chat/token` - Get Stream chat token

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/fluento` |
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | `your_secret_key_here` |
| `STEAM_API_KEY` | Stream.io API key | `your_stream_api_key` |
| `STEAM_API_SECRET` | Stream.io API secret | `your_stream_api_secret` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_STREAM_API_KEY` | Stream.io API key for frontend | `your_stream_api_key` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5001/api` |

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check your connection string in `.env`
   - For Atlas, ensure your IP is whitelisted

2. **Stream.io Errors**
   - Verify your API keys are correct
   - Make sure the same API key is used in both frontend and backend
   - Check Stream.io dashboard for usage limits

3. **Port Already in Use**
   - Change the PORT in backend `.env` file
   - Update VITE_API_BASE_URL in frontend `.env` accordingly

4. **CORS Errors**
   - Ensure frontend URL is correctly configured in backend CORS settings
   - Check that credentials are being sent with requests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Language Learning! 🌍📚**
