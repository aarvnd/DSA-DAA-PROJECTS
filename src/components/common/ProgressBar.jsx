export default function ProgressBar({ value = 0, label }) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-slate-300">{label}</span>
          <span className="text-sm font-medium text-indigo-400">{clampedValue}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
