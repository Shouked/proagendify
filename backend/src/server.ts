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

// Adicionar origens personalizadas da variável de ambiente, se existirem
if (env.ALLOWED_ORIGINS) {
  const envOrigins = env.ALLOWED_ORIGINS.split(',');
  envOrigins.forEach(origin => {
    if (origin && !allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin.trim());
    }
  });
}

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }),
);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Health check endpoint para o Render (manter ambos por compatibilidade)
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV 
  });
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});