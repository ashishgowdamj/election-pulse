import cors from 'cors';
import express from 'express';
import {
  fetchCasteSlices,
  fetchGenderAreaSlices,
  fetchStats,
  fetchVoters,
  parseFilters,
} from './lib/dashboard-service.js';

const app = express();

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'https://lovable.dev',
];

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? defaultOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin?: string | null) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.startsWith('http://localhost:')) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, sources: allowedOrigins.length });
});

app.get('/api/dashboard/stats', (req, res, next) => {
  try {
    const filters = parseFilters(req.query);
    const stats = fetchStats(filters);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

app.get('/api/dashboard/caste', (req, res, next) => {
  try {
    const filters = parseFilters(req.query);
    const data = fetchCasteSlices(filters);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/api/dashboard/gender-areas', (req, res, next) => {
  try {
    const filters = parseFilters(req.query);
    const data = fetchGenderAreaSlices(filters);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/api/dashboard/voters', (req, res, next) => {
  try {
    const filters = parseFilters(req.query);
    const payload = fetchVoters(filters);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(400).json({ message: err.message });
});

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`Dashboard API listening on http://localhost:${port}`);
});
