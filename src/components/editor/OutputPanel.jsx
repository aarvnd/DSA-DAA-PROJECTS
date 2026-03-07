export default function OutputPanel({ output, error, isRunning, status }) {
  return (
    <div className="bg-slate-900 border-t border-slate-700 p-4 font-mono text-sm overflow-auto" style={{ minHeight: "150px", maxHeight: "250px" }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-400 text-xs uppercase font-semibold">Output</span>
        {isRunning && (
          <span className="text-yellow-400 text-xs animate-pulse">Running...</span>
        )}
        {status && !isRunning && (
          <span className={`text-xs ${status.id === 3 ? "text-green-400" : "text-red-400"}`}>
            {status.description}
          </span>
        )}
      </div>
      {error ? (
        <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
      ) : output ? (
        <pre className="text-green-300 whitespace-pre-wrap">{output}</pre>
      ) : !isRunning ? (
        <p className="text-slate-500">Click &quot;Run Code&quot; to see output here</p>
      ) : null}
    </div>
  );
}
