import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/weights', async (req, res) => {
  try {
    const entries = await prisma.weightEntry.findMany({ orderBy: { date: 'asc' } });
    res.json(entries);
  } catch (error) {
    console.error('Failed to fetch weights', error);
    res.status(500).json({ error: 'Failed to fetch weights' });
  }
});

app.post('/api/weights', async (req, res) => {
  try {
    const { date, weight, note } = req.body;
    if (!date || !weight || Number.isNaN(Number(weight))) {
      return res.status(400).json({ error: 'Date and a valid weight are required.' });
    }

    const normalizedDate = new Date(`${date}T00:00:00.000Z`);
    const existing = await prisma.weightEntry.findUnique({ where: { date: normalizedDate } });

    const entry = existing
      ? await prisma.weightEntry.update({ where: { id: existing.id }, data: { weight: Number(weight), note: note || '' } })
      : await prisma.weightEntry.create({ data: { date: normalizedDate, weight: Number(weight), note: note || '' } });

    res.status(existing ? 200 : 201).json(entry);
  } catch (error) {
    console.error('Failed to save weight', error);
    res.status(500).json({ error: 'Failed to save weight entry' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port 3001');
});
