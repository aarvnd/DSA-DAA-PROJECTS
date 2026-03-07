import { useState } from "react";

export default function StackVisualizer() {
  const [stack, setStack] = useState([42, 17, 8]);
  const [inputVal, setInputVal] = useState("");
  const [message, setMessage] = useState("");
  const [animating, setAnimating] = useState(null);

  const push = () => {
    const val = inputVal.trim() || String(Math.floor(Math.random() * 100));
    setAnimating("push");
    setStack((prev) => [...prev, val]);
    setMessage(`Pushed ${val} onto the stack`);
    setInputVal("");
    setTimeout(() => setAnimating(null), 400);
  };

  const pop = () => {
    if (stack.length === 0) {
      setMessage("Stack Underflow! Stack is empty.");
      return;
    }
    setAnimating("pop");
    const val = stack[stack.length - 1];
    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
      setMessage(`Popped ${val} from the stack`);
      setAnimating(null);
    }, 300);
  };

  const peek = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty!");
      return;
    }
    setMessage(`Top element: ${stack[stack.length - 1]}`);
  };

  const clear = () => {
    setStack([]);
    setMessage("Stack cleared!");
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Stack Visualizer</h3>

      {/* Stack Display */}
      <div className="flex justify-center mb-4">
        <div className="w-48">
          {/* Top label */}
          {stack.length > 0 && (
            <div className="text-xs text-indigo-400 text-center mb-1">← TOP</div>
          )}

          {/* Stack elements (reversed - top first) */}
          <div className="border-l-2 border-r-2 border-b-2 border-slate-600 rounded-b-lg min-h-[200px] flex flex-col-reverse">
            {stack.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">Empty Stack</div>
            ) : (
              stack.map((item, idx) => (
                <div
                  key={`${idx}-${item}`}
                  className={`px-4 py-3 text-center font-mono font-bold border-t border-slate-600 transition-all duration-300 ${
                    idx === stack.length - 1
                      ? animating === "push"
                        ? "bg-green-600 text-white animate-slide-up"
                        : animating === "pop"
                        ? "bg-red-600 text-white opacity-50 translate-y-[-20px]"
                        : "bg-indigo-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {item}
                  {idx === stack.length - 1 && <span className="text-xs ml-2 opacity-60">top</span>}
                </div>
              ))
            )}
          </div>

          {/* Bottom label */}
          <div className="text-xs text-slate-500 text-center mt-1">Size: {stack.length}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center flex-wrap justify-center mb-3">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && push()}
          placeholder="Value"
          className="w-24 bg-slate-900 text-white border border-slate-600 rounded px-3 py-2 text-sm"
        />
        <button onClick={push} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors">
          Push
        </button>
        <button onClick={pop} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors">
          Pop
        </button>
        <button onClick={peek} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors">
          Peek
        </button>
        <button onClick={clear} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors">
          Clear
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="text-center text-sm text-amber-300 bg-amber-900/20 rounded px-3 py-2">
          {message}
        </div>
      )}
    </div>
  );
}
