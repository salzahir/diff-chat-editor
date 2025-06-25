"use client"
import fetchApi from "@/hooks/useApi";
import { useState } from "react";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const response = await fetchApi(userInput);
      setData(response);
    } catch (error) {
      setError('Error fetching API');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black-50 p-6">
        <h1 className="text-2xl font-medium mb-6">Diff Chat Editor</h1>

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

        {error && <p className="text-red-500 mt-4 max-w-xl text-center">{error}</p>}

        {data && (
            <div className="w-full max-w-xl mt-6 p-4 border border-gray-300 rounded">
                <h2 className="font-medium mb-2">AI Response:</h2>
                <p>{data}</p>
            </div>
        )}
    </div>
);
}

