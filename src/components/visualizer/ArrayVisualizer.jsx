import { useState, useEffect, useRef } from "react";

const SORTING_ALGORITHMS = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
};

function generateArray(size = 20) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
}

function getBubbleSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], swapped: [j, j + 1] });
      }
    }
  }
  steps.push({ array: [...a], done: true });
  return steps;
}

function getSelectionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], comparing: [minIdx, j], sorted: i });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], swapped: [i, minIdx] });
    }
  }
  steps.push({ array: [...a], done: true });
  return steps;
}

function getInsertionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j] < a[j - 1]) {
      steps.push({ array: [...a], comparing: [j, j - 1] });
      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      steps.push({ array: [...a], swapped: [j, j - 1] });
      j--;
    }
  }
  steps.push({ array: [...a], done: true });
  return steps;
}

export default function ArrayVisualizer() {
  const [array, setArray] = useState(() => generateArray());
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble");
  const intervalRef = useRef(null);

  const maxVal = Math.max(...array, 100);

  const generateSteps = (algo, arr) => {
    switch (algo) {
      case "selection": return getSelectionSortSteps(arr);
      case "insertion": return getInsertionSortSteps(arr);
      default: return getBubbleSortSteps(arr);
    }
  };

  const handleGenerate = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const newArr = generateArray();
    setArray(newArr);
    setSteps(generateSteps(algorithm, newArr));
    setCurrentStep(0);
  };

  const handleStart = () => {
    if (steps.length === 0) {
      const s = generateSteps(algorithm, array);
      setSteps(s);
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    if (steps.length === 0) {
      setSteps(generateSteps(algorithm, array));
    }
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 200 - speed * 1.8);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isPlaying, currentStep, speed, steps.length]);

  const step = steps[currentStep] || { array, comparing: [], swapped: [] };

  const getBarColor = (idx) => {
    if (step.done) return "bg-green-500";
    if (step.swapped?.includes(idx)) return "bg-red-500";
    if (step.comparing?.includes(idx)) return "bg-yellow-400";
    return "bg-indigo-500";
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Sorting Visualizer</h3>
        <select
          value={algorithm}
          onChange={(e) => {
            setAlgorithm(e.target.value);
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            const s = generateSteps(e.target.value, array);
            setSteps(s);
            setCurrentStep(0);
          }}
          className="bg-slate-700 text-white text-sm rounded px-3 py-1 border border-slate-600"
        >
          {Object.entries(SORTING_ALGORITHMS).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1 h-48 mb-4 bg-slate-900 rounded p-3">
        {step.array.map((val, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-t transition-all duration-150 ${getBarColor(idx)}`}
            style={{ height: `${(val / maxVal) * 100}%` }}
            title={String(val)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={isPlaying ? () => setIsPlaying(false) : handleStart}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={() => {
            setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
            setIsPlaying(false);
          }}
          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
        >
          Step →
        </button>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
        >
          🔄 New Array
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-400">Speed:</span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded inline-block" /> Normal</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded inline-block" /> Comparing</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded inline-block" /> Swapping</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded inline-block" /> Sorted</span>
      </div>
      <div className="text-xs text-slate-500 mt-2">
        Step: {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
}
