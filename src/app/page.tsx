"use client"
import fetchApi from "@/hooks/useApi";
import { useState } from "react";
import ReactDiffViewer from 'react-diff-viewer-continued';
import Version from "@/types/version";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'rewrite' | 'question' | 'suggestion'>('rewrite');
  const [versions, setVersions] = useState<Version[]>([]);

  function revertToVersion(version: number) {
    setUserInput(versions[version].text);
  }

  function addVersion(prompt: string = 'Manual save') {
    const newVersion: Version = {
      id: versions.length + 1,
      text: userInput,
      timestamp: new Date(),
      prompt: prompt
    };
    setVersions([...versions, newVersion]);
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const response = await fetchApi(userInput, mode);
      setData(response);
    } catch (error) {
      console.error('Error fetching API:', error);
      setError('Error fetching API ${error}');
    } finally {
      setLoading(false);
    }
  }

  function renderSuggestion(original: string, revised: string) {
    const originalLines = original.split('\n');
    const revisedLines = revised.split('\n');

    return originalLines.map((line, i) => {
        if (line !== revisedLines[i]) {
            return (
                <div key={i} className="text-red-500 mb-2">
                    {line} 
                    <span className="text-black ml-2">Suggested revision:</span> 
                    <span className="text-green-500 ml-1">{revisedLines[i] || ''}</span>
                    <button 
                        onClick={() => {
                            const updatedLines = [...originalLines];
                            updatedLines[i] = revisedLines[i] || '';
                            setUserInput(updatedLines.join('\n'));
                        }} 
                        className="text-blue-500 hover:underline ml-2"
                    >
                        Accept
                    </button>
                </div>
            );
        } else {
            return (
                <div key={i} className="mb-2">
                    {line}
                </div>
            );
        }
    });

  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black-50 p-6">
        <h1 className="text-2xl font-medium mb-6">Diff Chat Editor</h1>
        <select value={mode} onChange={(e) => {
          setMode(e.target.value as 'rewrite' | 'question' | 'suggestion');
        }} className="mb-4 p-2 border rounded">
          <option value="rewrite">Rewrite Mode</option>
          <option value="question">Question Mode</option>
          <option value="suggestion">Suggestion Mode</option>
        </select>

        <div className="w-full max-w-xl mb-4">
            <h2 className="text-lg font-medium mb-2">Version History</h2>
            {versions.map((version, index) => (
                <div key={version.id} className="flex justify-between items-center mb-1">
                    <span>Version {version.id} - {version.timestamp.toLocaleTimeString()}</span>
                    <button 
                        onClick={() => revertToVersion(index)} 
                        className="text-blue-500 hover:underline"
                    >
                        Revert
                    </button>
                </div>
            ))}
        </div>

        <textarea
            className="w-full max-w-xl h-40 p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your text here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
        />

        <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full max-w-xl py-2 px-4 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
            {loading ? 'Loading...' : 'Submit'}
        </button>

        <button
            onClick={() => addVersion('Manual save')}
            className="w-full max-w-xl py-2 px-4 rounded text-white bg-green-500 hover:bg-green-600 mb-4"
        >
            Save Version
        </button>

        {error && <p className="text-red-500 mt-4 max-w-xl text-center">{error}</p>}

        {data && (
          <div className="w-full max-w-xl mt-6 p-4 border border-gray-300 rounded bg-black-100">
            {mode === 'rewrite' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium">AI Rewrite</h2>
                  <button
                    onClick={() => {
                      setUserInput(data);
                      addVersion('AI rewrite applied');
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Apply Changes
                  </button>
                </div>
                <ReactDiffViewer oldValue={userInput} newValue={data} splitView={false} />
              </div>
            )}
            {mode === 'suggestion' && (
              <>
                <h2 className="font-medium mb-2">Suggestions:</h2>
                <div className="text-red-500">
                  {renderSuggestion(userInput, data)}
                </div>
              </>
            )}
            {mode === 'question' && (
              <>
                <h2 className="font-medium mb-2">AI Response:</h2>
                <p>{data}</p>
              </>
            )}
          </div>
        )}
    </div>
);
}
