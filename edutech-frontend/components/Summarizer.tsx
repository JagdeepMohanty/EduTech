'use client';

import React, { useState, useEffect } from 'react';
import { SummarizeRequest, SummarizeResponse, SummaryHistory } from '@/types/summarization';
import { summarizationService } from '@/services/summarization';

const Summarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState<SummarizeResponse | null>(null);
  const [history, setHistory] = useState<SummaryHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [maxLength, setMaxLength] = useState(150);
  const [minLength, setMinLength] = useState(30);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await summarizationService.getSummaryHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const request: SummarizeRequest = {
        text: inputText,
        max_length: maxLength,
        min_length: minLength,
      };
      const result = await summarizationService.summarizeText(request);
      setSummary(result);
      loadHistory(); // Refresh history
    } catch (error) {
      console.error('Error summarizing text:', error);
      alert('Failed to summarize text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Content Summarization</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
            Enter text to summarize:
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-40 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          />
          <div className="text-sm text-gray-500 mt-1">
            Word count: {wordCount}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="maxLength" className="block text-sm font-medium text-gray-700 mb-1">
              Max Summary Length (words):
            </label>
            <input
              type="number"
              id="maxLength"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              min="30"
              max="300"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="minLength" className="block text-sm font-medium text-gray-700 mb-1">
              Min Summary Length (words):
            </label>
            <input
              type="number"
              id="minLength"
              value={minLength}
              onChange={(e) => setMinLength(Number(e.target.value))}
              min="10"
              max="100"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSummarize}
          disabled={!inputText.trim() || isLoading || wordCount < 10}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded w-full"
        >
          {isLoading ? 'Summarizing...' : 'Summarize Text'}
        </button>

        {wordCount < 10 && inputText.trim() && (
          <div className="text-red-500 text-sm mt-2">
            Text must be at least 10 words long.
          </div>
        )}
      </div>

      {summary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-700 mb-4">{summary.summary}</p>
          <div className="text-sm text-gray-500">
            <p>Original length: {summary.original_length} words</p>
            <p>Summary length: {summary.summary_length} words</p>
            <p>Compression ratio: {((1 - summary.summary_length / summary.original_length) * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Summary History</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-500 hover:text-blue-600"
          >
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        </div>

        {showHistory && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-gray-500">No summaries yet.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-md p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <strong>Original:</strong> {item.original_text}
                  </div>
                  <div className="mb-2">
                    <strong>Summary:</strong> {item.summary}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.original_length} → {item.summary_length} words
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Summarizer;
