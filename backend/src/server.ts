import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes';

config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 