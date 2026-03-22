import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function SummaryCard({ icon: Icon, label, value, hint, tone = 'default' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[24px] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className={clsx('mt-3 text-3xl font-bold tracking-tight', tone === 'positive' ? 'text-emerald-600' : 'text-slate-900')}>{value}</p>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
