import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Loader2, MessageSquare, Lightbulb, HelpCircle } from 'lucide-react';
import { analyzeTask, answerQuestion, suggestSubtasks } from '../services/geminiService';

export default function AIAssistant({ task, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('analyze'); // 'analyze', 'question', 'subtasks'
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [subtasks, setSubtasks] = useState([]);

  const handleAnalyze = useCallback(async () => {
    if (!task) return;
    
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const analysis = await analyzeTask(task);
      setResponse(analysis);
    } catch (err) {
      setError(err.message || 'Failed to analyze task. Please check your API key configuration.');
    } finally {
      setLoading(false);
    }
  }, [task]);

  const handleAskQuestion = async () => {
    if (!task || !question.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const answer = await answerQuestion(task, question);
      setResponse(answer);
    } catch (err) {
      setError(err.message || 'Failed to get answer. Please check your API key configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestSubtasks = async () => {
    if (!task) return;
    
    setLoading(true);
    setError('');
    setSubtasks([]);
    
    try {
      const suggested = await suggestSubtasks(task);
      setSubtasks(Array.isArray(suggested) ? suggested : []);
    } catch (err) {
      setError(err.message || 'Failed to suggest subtasks. Please check your API key configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-analyze when component opens
  useEffect(() => {
    if (isOpen && task && activeTab === 'analyze' && !response && !loading) {
      handleAnalyze();
    }
  }, [isOpen, task, activeTab, response, loading, handleAnalyze]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  AI Assistant
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task?.title || 'Task Analysis'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setActiveTab('analyze');
                setResponse('');
                setError('');
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'analyze'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span>Analyze</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('question');
                setResponse('');
                setError('');
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'question'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>Ask Question</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('subtasks');
                setSubtasks([]);
                setError('');
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'subtasks'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Subtasks</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {activeTab === 'analyze' && (
              <div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing task...</span>
                  </div>
                ) : response ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                      {response}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Click the button below to analyze this task
                    </p>
                    <button
                      onClick={handleAnalyze}
                      className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Analyze Task
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'question' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ask a question about this task
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !loading && handleAskQuestion()}
                      placeholder="e.g., How should I approach this task? What are the key steps?"
                      className="flex-1 input-field"
                    />
                    <button
                      onClick={handleAskQuestion}
                      disabled={!question.trim() || loading}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Ask</span>
                    </button>
                  </div>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin" />
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Getting answer...</span>
                  </div>
                )}

                {response && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                      {response}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subtasks' && (
              <div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Generating subtasks...</span>
                  </div>
                ) : subtasks.length > 0 ? (
                  <div className="space-y-3">
                    {subtasks.map((subtask, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {index + 1}. {subtask.title}
                        </h4>
                        {subtask.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {subtask.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Get AI-suggested subtasks to break down this task
                    </p>
                    <button
                      onClick={handleSuggestSubtasks}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Generate Subtasks
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

