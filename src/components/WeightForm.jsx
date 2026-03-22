export default function WeightForm({ form, setForm, onSubmit, saving }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Date</span>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
          className="min-h-[48px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-brand-400 focus:bg-white"
          required
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Weight (lb)</span>
        <input
          type="number"
          step="0.1"
          min="1"
          placeholder="e.g. 182.4"
          value={form.weight}
          onChange={(e) => setForm((current) => ({ ...current, weight: e.target.value }))}
          className="min-h-[48px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-brand-400 focus:bg-white"
          required
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Note</span>
        <textarea
          rows="4"
          placeholder="Optional note about sleep, workout, meals, or how you felt"
          value={form.note}
          onChange={(e) => setForm((current) => ({ ...current, note: e.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand-400 focus:bg-white"
        />
      </label>
      <button type="submit" disabled={saving} className="min-h-[48px] w-full rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70">
        {saving ? 'Saving entry...' : 'Save weight entry'}
      </button>
    </form>
  );
}
