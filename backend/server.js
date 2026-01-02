import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectDb } from './config/db.js';
import router from './routes/routes.js';
dotenv.config({override:true});

const app = express();
const PORT = process.env.PORT || 5000;
// Allow only your frontend origin 
app.use(cors({
   origin: "https://todo-app-727u.onrender.com", 
   methods: ["GET", "POST", "PUT", "DELETE"],
   credentials: true }));
app.use(express.json());
app.use('/api/todo',router)
app.get("/health", (req, res) => { res.status(200).send("OK"); });



app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  connectDb();
  
});


