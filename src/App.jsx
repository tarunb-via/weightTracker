import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, CalendarDays, Scale, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import SummaryCard from './components/SummaryCard';
import WeightForm from './components/WeightForm';
import WeightChart from './components/WeightChart';
import WeightHistory from './components/WeightHistory';

const emptyForm = {
  date: format(new Date(), 'yyyy-MM-dd'),
  weight: '',
  note: '',
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/weights');
      setEntries(data);
    } catch (err) {
      setError('Unable to load your weight history right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const stats = useMemo(() => {
    if (!entries.length) {
      return {
        latest: null,
        change: null,
        average: null,
        streak: 0,
      };
    }

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const latest = sorted.at(-1);
    const previous = sorted.at(-2);
    const average = sorted.reduce((sum, item) => sum + item.weight, 0) / sorted.length;

    let streak = 1;
    for (let i = sorted.length - 1; i > 0; i -= 1) {
      const current = new Date(sorted[i].date);
      const prior = new Date(sorted[i - 1].date);
      const diff = Math.round((current - prior) / (1000 * 60 * 60 * 24));
      if (diff === 1) streak += 1;
      else break;
    }

    return {
      latest,
      change: previous ? latest.weight - previous.weight : null,
      average,
      streak,
    };
  }, [entries]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      await axios.post('/api/weights', {
        date: form.date,
        weight: Number(form.weight),
        note: form.note,
      });
      setForm(emptyForm);
      await loadEntries();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save your entry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen pb-10 text-slate-900">
      <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 md:py-14">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <Activity className="h-4 w-4" />
              Daily weight tracking with long-term trends
            </div>
            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">WeightFlow keeps your daily progress clear and motivating.</h1>
              <p className="text-base leading-relaxed text-white/85 md:text-lg">
                Log your weight each day, spot trends across months, and stay focused with a calm dashboard built for consistency.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard icon={Scale} label="Latest weight" value={stats.latest ? `${stats.latest.weight.toFixed(1)} lb` : '—'} hint={stats.latest ? format(new Date(stats.latest.date), 'MMM d, yyyy') : 'Add your first entry'} />
          <SummaryCard icon={TrendingUp} label="Day-to-day change" value={stats.change === null ? '—' : `${stats.change > 0 ? '+' : ''}${stats.change.toFixed(1)} lb`} hint="Compared with your previous entry" tone={stats.change !== null && stats.change <= 0 ? 'positive' : 'default'} />
          <SummaryCard icon={CalendarDays} label="Average weight" value={stats.average ? `${stats.average.toFixed(1)} lb` : '—'} hint="Across all recorded days" />
          <SummaryCard icon={Activity} label="Current streak" value={`${stats.streak} day${stats.streak === 1 ? '' : 's'}`} hint="Consecutive daily check-ins" />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="rounded-[28px] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-6">
            <div className="mb-5 space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Log today&apos;s weight</h2>
              <p className="text-base leading-relaxed text-slate-600">A quick daily entry helps the monthly graph stay meaningful.</p>
            </div>
            <WeightForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} />
            {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p> : null}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="space-y-6">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Weight trend over time</h2>
                  <p className="text-base text-slate-600">See your day-to-day changes across weeks and months.</p>
                </div>
                <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  {entries.length} recorded day{entries.length === 1 ? '' : 's'}
                </div>
              </div>
              <WeightChart entries={entries} loading={loading} />
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Recent history</h2>
                  <p className="text-base text-slate-600">Your latest entries, notes, and daily movement.</p>
                </div>
                <button onClick={loadEntries} className={clsx('min-h-[44px] rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200')}>
                  Refresh
                </button>
              </div>
              <WeightHistory entries={entries} loading={loading} />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
