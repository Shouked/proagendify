import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes';
import { env } from './lib/env';

config();

const app = express();

// Configuração de CORS com origens permitidas
const allowedOrigins = [
  'http://localhost:3000',
  'https://proagendify.vercel.app',
  'https://proagendify-frontend.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requisições sem origem (como apps mobile ou Postman)
      if (!origin) return callback(null, true);

      // Permitir qualquer origem do Vercel (incluindo previews)
      if (origin && (origin.includes('vercel.app') || origin.includes('localhost'))) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`Origem bloqueada pelo CORS: ${origin}`);
        callback(new Error('Não permitido pelo CORS'), false);
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});