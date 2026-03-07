import { useLanguage } from "../../hooks/useLanguage";

export default function CompilerToolbar({ onRun, onReset, isRunning }) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 border-t border-slate-700">
      <button
        onClick={onRun}
        disabled={isRunning}
        className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${
          isRunning
            ? "bg-slate-600 text-slate-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isRunning ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("running")}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            {t("run")}
          </>
        )}
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 rounded text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
      >
        {t("reset")}
      </button>
    </div>
  );
}
