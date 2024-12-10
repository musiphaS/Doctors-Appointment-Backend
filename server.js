import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import adminRouter from './routes/adminRoute.js';

// App Configuration
const app = express();
const port = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middlewares
app.use(express.json()); // For parsing JSON
app.use(cors()); // To allow cross-origin requests

// Debugging incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// API Endpoints
app.use('/api/admin', adminRouter);
app.get('/', (req, res) => res.send('API is working great!'));

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));