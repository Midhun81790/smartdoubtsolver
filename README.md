# Smart Doubt Solver

A web application where students can ask doubts and get help from others. Built with MERN stack and includes some cool features like automatic tagging and finding similar questions.

## What does this do?

This is basically a Q&A platform for students. When someone posts a question, the app automatically:
- Figures out relevant tags for the question
- Finds if similar questions were already asked
- Extracts important keywords from the question

This helps reduce duplicate questions and makes it easier to find answers.

## Features

- User registration and login
- Post questions (doubts) with title and description
- Automatically tags questions based on content
- Finds similar questions using text similarity
- Reply to questions
- Upvote helpful replies
- Mark answers as accepted
- Search and filter by tags
- Responsive design

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for passwords

**Frontend:**
- React
- React Router
- Axios for API calls
- Bootstrap for styling
- React Toastify for notifications

**The Smart Stuff:**
- Cosine similarity algorithm to find similar questions
- Keyword extraction from text
- Auto-tagging based on content analysis

## Project Structure

```
backend/
├── controllers/     # Business logic
├── models/          # Database schemas
├── routes/          # API endpoints
├── middleware/      # Auth middleware
├── utils/           # NLP utilities (similarity, tagging)
└── server.js        # Main server file

frontend/
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── context/     # State management
│   └── utils/       # API config
└── public/
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free tier works fine)

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in backend folder:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the app:
```bash
npm start
```

The app should open at http://localhost:3000

## How to Use

1. Register an account
2. Login with your credentials
3. Click "Ask Doubt" to post a question
4. The system will automatically suggest tags and show similar questions if any exist
5. Browse questions on the home page
6. Click on any question to see details and add replies
7. Upvote helpful answers
8. Mark an answer as accepted if you're the question owner

## API Endpoints

**Auth:**
- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login

**Doubts:**
- GET `/api/doubts` - Get all doubts (with optional filters)
- GET `/api/doubts/:id` - Get single doubt
- POST `/api/doubts` - Create doubt (auth required)
- PATCH `/api/doubts/:id` - Update doubt (auth required)
- DELETE `/api/doubts/:id` - Delete doubt (auth required)

**Replies:**
- POST `/api/replies/:doubtId` - Add reply (auth required)
- PATCH `/api/replies/:replyId/upvote` - Upvote reply (auth required)
- PATCH `/api/replies/:replyId/accept` - Accept reply (auth required)

## How the Smart Features Work

### Similar Question Detection

When someone posts a question, the system:
1. Takes the question text
2. Compares it with all existing questions using cosine similarity
3. If similarity is above 30%, it shows as a similar question
4. Shows the top 3 most similar questions with percentage match

The cosine similarity algorithm works by converting text into vectors and calculating the angle between them. Smaller angle = more similar text.

### Auto-Tagging

The system has predefined categories like:
- Data Structures (dsa, algorithms, tree, etc.)
- Programming languages (java, python, javascript)
- Web development (html, css, react, etc.)
- Databases (sql, mongodb, etc.)

It extracts keywords from the question and matches them against these categories to suggest relevant tags.

### Keyword Extraction

Removes common words (like "is", "the", "a") and finds the most important words based on frequency and relevance.

## Known Issues

- Similarity detection works better with longer descriptions
- Auto-tags might not be 100% accurate for very short questions
- Need to add email notifications for new replies

## Future Improvements

- Add code syntax highlighting
- Allow attaching images
- Add email notifications
- Improve tag prediction with machine learning
- Add user reputation system
- Make it real-time with websockets

## Configuration

Make sure to set up your MongoDB connection properly. In MongoDB Atlas:
1. Create a cluster
2. Create a database user
3. Whitelist your IP address
4. Get the connection string
5. Replace `<password>` with your actual password in the connection string

For JWT_SECRET, just use any random string. In production, use something more secure.

## Troubleshooting

**Port already in use:**
Change the PORT in .env file

**MongoDB connection error:**
Check your connection string and make sure IP is whitelisted

**Frontend can't reach backend:**
Make sure backend is running on port 5000 or update the API URL in frontend

## License

Feel free to use this code for learning or your own projects.

---

Made with React and Node.js
