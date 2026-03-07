import { JUDGE0_URL, LANGUAGE_IDS } from "../utils/constants";

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "";

const PISTON_URL = "https://emkc.org/api/v2/piston";

const PISTON_LANGUAGE_MAP = {
  c: { language: "c", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "javascript", version: "18.15.0" },
};

async function executeWithJudge0(sourceCode, language, stdin = "") {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  const response = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: btoa(unescape(encodeURIComponent(sourceCode))),
        language_id: languageId,
        stdin: btoa(unescape(encodeURIComponent(stdin))),
      }),
    }
  );

  if (!response.ok) throw new Error(`Judge0 API error: ${response.status}`);

  const result = await response.json();
  return {
    stdout: result.stdout ? decodeURIComponent(escape(atob(result.stdout))) : "",
    stderr: result.stderr ? decodeURIComponent(escape(atob(result.stderr))) : "",
    compile_output: result.compile_output
      ? decodeURIComponent(escape(atob(result.compile_output)))
      : "",
    status: result.status,
    time: result.time,
    memory: result.memory,
  };
}

async function executeWithPiston(sourceCode, language, stdin = "") {
  const langConfig = PISTON_LANGUAGE_MAP[language];
  if (!langConfig) throw new Error(`Unsupported language: ${language}`);

  const response = await fetch(`${PISTON_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: sourceCode }],
      stdin: stdin,
    }),
  });

  if (!response.ok) throw new Error(`Piston API error: ${response.status}`);

  const result = await response.json();
  const run = result.run || {};
  return {
    stdout: run.stdout || "",
    stderr: run.stderr || "",
    compile_output: result.compile?.stderr || "",
    status: {
      id: run.code === 0 ? 3 : 11,
      description: run.code === 0 ? "Accepted" : "Runtime Error",
    },
    time: null,
    memory: null,
  };
}

export async function executeCode(sourceCode, language, stdin = "") {
  if (RAPIDAPI_KEY) {
    return executeWithJudge0(sourceCode, language, stdin);
  }
  return executeWithPiston(sourceCode, language, stdin);
}

export async function runTestCases(sourceCode, language, testCases) {
  const results = [];
  for (const tc of testCases) {
    try {
      const result = await executeCode(sourceCode, language, tc.input);
      const actualOutput = (result.stdout || "").trim();
      const expectedOutput = (tc.expectedOutput || "").trim();
      results.push({
        ...tc,
        actualOutput,
        passed: actualOutput === expectedOutput,
        error: result.stderr || result.compile_output || "",
        status: result.status,
      });
    } catch (err) {
      results.push({
        ...tc,
        actualOutput: "",
        passed: false,
        error: err.message,
        status: { id: 0, description: "Error" },
      });
    }
  }
  return results;
}
