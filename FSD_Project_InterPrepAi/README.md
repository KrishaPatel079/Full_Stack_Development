# 🚀 InterviewPrepAI - AI-Powered Interview Preparation Platform

A comprehensive MERN stack application that helps developers prepare for technical interviews using AI-powered learning, coding practice, and personalized feedback.

## ✨ Features

### 🎯 Core Features
- **Authentication System** - Secure signup/login with JWT tokens
- **Question Bank** - Extensive collection of coding questions with filtering
- **AI Interviewer** - OpenAI-powered chatbot for interview practice
- **Coding Practice** - Monaco Editor integration with test case execution
- **Mock Interviews** - Timed interview sessions with random questions
- **Resume Analyzer** - AI-powered resume feedback and improvement suggestions
- **Progress Tracking** - Comprehensive analytics and achievement system
- **Daily Challenges** - Consistent practice with daily questions
- **Gamification** - Streaks, points, levels, and badges

### 🎨 Design Features
- **Modern UI/UX** - Beautiful pastel theme (pink, blue, cream)
- **Responsive Design** - Works perfectly on all devices
- **Smooth Animations** - Engaging user experience with Framer Motion
- **Glass Morphism** - Modern backdrop blur effects
- **TailwindCSS** - Utility-first CSS framework

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Monaco Editor** - Professional code editor
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **OpenAI API** - AI-powered features
- **Multer** - File upload handling
- **PDF Parse** - Resume text extraction

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd InterviewPrepAI
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Return to root
cd ..
```

### 3. Environment Setup

#### Backend (.env)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interviewprepai
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
NODE_ENV=development
```

#### Frontend Configuration
The frontend is configured to connect to `http://localhost:5000` by default.

### 4. Start the Application
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run server  # Backend only
npm run client  # Frontend only
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
InterviewPrepAI/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # TailwindCSS configuration
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## 🔧 Configuration

### MongoDB Connection
The application connects to MongoDB using the `MONGODB_URI` environment variable. You can use:
- **Local MongoDB**: `mongodb://localhost:27017/interviewprepai`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/interviewprepai`

### OpenAI API
To use AI features, you need an OpenAI API key:
1. Sign up at [OpenAI](https://openai.com)
2. Get your API key from the dashboard
3. Add it to your `.env` file

### Port Configuration
- **Backend**: Configure via `PORT` environment variable (default: 5000)
- **Frontend**: Configure via `REACT_APP_API_URL` environment variable

## 🎯 Usage

### 1. User Registration
- Visit the signup page
- Create an account with your details
- Verify your email (if configured)

### 2. Dashboard
- View your progress and statistics
- Access daily challenges
- Quick navigation to all features

### 3. Question Bank
- Browse questions by category and difficulty
- Filter by tags and search terms
- View question details and attempt solutions

### 4. Coding Practice
- Use the Monaco Editor for code writing
- Run code against test cases
- Get instant feedback and results

### 5. Mock Interviews
- Start timed interview sessions
- Answer questions within time limits
- Review results and AI feedback

### 6. AI Interviewer
- Practice interview questions
- Get AI-powered feedback
- Improve your communication skills

### 7. Resume Analyzer
- Upload your resume (PDF)
- Get AI-powered feedback
- Improve your resume with suggestions

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Input Validation** - Comprehensive form validation
- **Rate Limiting** - API rate limiting for security
- **CORS Configuration** - Secure cross-origin requests
- **Helmet.js** - Security headers and protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - User logout

### Questions
- `GET /api/questions` - Get questions with filters
- `GET /api/questions/:id` - Get specific question
- `GET /api/questions/daily` - Get daily question
- `POST /api/questions/:id/attempt` - Record attempt

### AI Features
- `POST /api/ai/interview` - AI interview feedback
- `POST /api/ai/code-review` - AI code review
- `POST /api/ai/explain-concept` - AI concept explanation

### Code Execution
- `POST /api/code/execute` - Execute code with test cases
- `POST /api/code/validate` - Validate code syntax
- `POST /api/code/format` - Format code

### Mock Interviews
- `POST /api/mock/start` - Start mock interview
- `POST /api/mock/:id/answer` - Submit answer
- `GET /api/mock/:id/status` - Get interview status

### Resume Analysis
- `POST /api/resume/analyze` - Analyze resume
- `GET /api/resume/history` - Get analysis history
- `GET /api/resume/stats` - Get resume statistics

## 🎨 Customization

### Theme Colors
The application uses a custom pastel theme. You can modify colors in:
- `client/tailwind.config.js` - TailwindCSS configuration
- `client/src/index.css` - Custom CSS variables

### Styling
- **Components**: Use TailwindCSS utility classes
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography

## 🚀 Deployment

### Frontend (React)
```bash
cd client
npm run build
# Deploy the build folder to your hosting service
```

### Backend (Node.js)
```bash
cd server
npm start
# Use PM2 or similar for production
```

### Environment Variables
Make sure to set all required environment variables in production:
- `MONGODB_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - For AI-powered features
- **Monaco Editor** - For the code editor
- **TailwindCSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Lucide React** - For beautiful icons

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Contact: contact@interviewprepai.com
- Documentation: [Coming Soon]

---

**Made with ❤️ for the developer community**

