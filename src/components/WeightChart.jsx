import { format } from 'date-fns';

function buildPath(points, width, height, minWeight, maxWeight) {
  if (points.length < 2) return '';
  const range = maxWeight - minWeight || 1;
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point.weight - minWeight) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

export default function WeightChart({ entries, loading }) {
  if (loading) {
    return <div className="flex h-[280px] items-center justify-center rounded-[24px] bg-slate-50 text-base font-medium text-slate-500">Loading chart...</div>;
  }

  if (!entries.length) {
    return <div className="flex h-[280px] items-center justify-center rounded-[24px] bg-slate-50 px-6 text-center text-base leading-relaxed text-slate-500">No entries yet. Add your first daily weight to start building your monthly trend graph.</div>;
  }

  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const minWeight = Math.min(...sorted.map((item) => item.weight)) - 1;
  const maxWeight = Math.max(...sorted.map((item) => item.weight)) + 1;
  const width = 760;
  const height = 240;
  const path = buildPath(sorted, width, height, minWeight, maxWeight);

  return (
    <div className="space-y-4 overflow-hidden rounded-[24px] bg-slate-50 p-4 md:p-5">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height + 40}`} className="min-w-[640px]">
          {[0, 1, 2, 3, 4].map((line) => {
            const y = (height / 4) * line;
            const value = (maxWeight - ((maxWeight - minWeight) / 4) * line).toFixed(1);
            return (
              <g key={line}>
                <line x1="0" y1={y} x2={width} y2={y} stroke="#cbd5e1" strokeDasharray="4 6" />
                <text x="0" y={Math.max(14, y - 6)} fill="#64748b" fontSize="12">{value} lb</text>
              </g>
            );
          })}
          <path d={path} fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          {sorted.map((point, index) => {
            const x = sorted.length === 1 ? width / 2 : (index / (sorted.length - 1)) * width;
            const y = height - ((point.weight - minWeight) / (maxWeight - minWeight || 1)) * height;
            return (
              <g key={point.id}>
                <circle cx={x} cy={y} r="5" fill="#14b8a6" />
                <text x={x} y={height + 24} textAnchor="middle" fill="#475569" fontSize="12">
                  {format(new Date(point.date), sorted.length > 12 ? 'MMM' : 'MMM d')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-sm leading-relaxed text-slate-500">Tip: consistent daily entries make it easier to spot weekly patterns and long-term monthly trends.</p>
    </div>
  );
}
