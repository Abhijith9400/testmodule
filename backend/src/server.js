import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import foodRouter from './routers/food.router.js';
import userRouter from './routers/user.router.js';
import orderRouter from './routers/order.router.js';
import uploadRouter from './routers/upload.router.js';


import { dbconnect } from './config/database.config.js';  // Use this if it's a named export
import path, { dirname } from 'path';
console.log('ENV LOADED, MONGO_URI:', process.env.MONGO_URI);


// Connect to the database
dbconnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'], // Adjust this to your frontend URL
  })
);

// Define API Routes
app.use('/api/foods', foodRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// Serve static files from the 'public' folder
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

// Handle React's client-side routing by serving index.html for unmatched routes
app.get('/api/admin/dashboard', async (req, res) => {
  try {
      const data = await YourModel.find(); // Fetch data from your collection
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}); 

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
