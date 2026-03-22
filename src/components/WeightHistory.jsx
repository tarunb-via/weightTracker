import { format } from 'date-fns';

export default function WeightHistory({ entries, loading }) {
  if (loading) {
    return <div className="rounded-[24px] bg-slate-50 px-4 py-10 text-center text-base text-slate-500">Loading entries...</div>;
  }

  if (!entries.length) {
    return <div className="rounded-[24px] bg-slate-50 px-4 py-10 text-center text-base text-slate-500">No history yet. Your saved entries will appear here.</div>;
  }

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-3">
      {sorted.slice(0, 10).map((entry, index) => {
        const previous = sorted[index + 1];
        const delta = previous ? entry.weight - previous.weight : null;
        return (
          <div key={entry.id} className="rounded-[24px] bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{entry.weight.toFixed(1)} lb</p>
                <p className="text-sm text-slate-500">{format(new Date(entry.date), 'EEEE, MMM d, yyyy')}</p>
                {entry.note ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{entry.note}</p> : null}
              </div>
              <div className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                {delta === null ? 'First entry' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)} lb`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
