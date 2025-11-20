import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const getGeminiClient = () => {
  // Get the API key from Vite environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Debug: Log environment variables (remove in production)
  console.log('🔍 Environment Debug:', {
    hasKey: !!apiKey,
    keyType: typeof apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    keyPrefix: apiKey ? apiKey.substring(0, 15) + '...' : 'none',
    allViteEnvKeys: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD
  });
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    const errorMsg = `Gemini API key is not configured. 
    
Troubleshooting steps:
1. Make sure .env file exists in the project root (same folder as package.json)
2. Make sure the file contains: VITE_GEMINI_API_KEY=your_actual_key
3. No spaces around the = sign
4. Restart the dev server completely (stop with Ctrl+C, then npm run dev)
5. Hard refresh browser (Ctrl+Shift+R)

Current status:
- API Key found: ${!!apiKey}
- Key value: ${apiKey ? 'Present but invalid' : 'Missing'}
- All VITE_ env vars: ${Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')).join(', ') || 'None found'}`;
    
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }
  
  const trimmedKey = apiKey.trim();
  console.log('✅ API Key loaded successfully, length:', trimmedKey.length);
  
  return new GoogleGenerativeAI(trimmedKey);
};

/**
 * Analyze a task and provide insights, solutions, and clarifications
 * @param {Object} task - The task object with title, description, priority, etc.
 * @param {string} question - Optional specific question about the task
 * @returns {Promise<string>} AI-generated analysis and recommendations
 */
export const analyzeTask = async (task, question = null) => {
  try {
    console.log('🚀 Starting task analysis...');
    const genAI = getGeminiClient();
    // Try gemini-1.5-flash or gemini-pro depending on availability
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini client initialized with model: gemini-1.5-flash');

    const taskInfo = `
Task Title: ${task.title}
Description: ${task.description || 'No description provided'}
Priority: ${task.priority}
Status: ${task.status}
Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
Completed: ${task.completed ? 'Yes' : 'No'}
`;

    let prompt = `You are an AI task management assistant. Analyze the following task and provide helpful insights:

${taskInfo}

Please provide:
1. A brief analysis of what this task involves
2. Potential challenges or obstacles that might arise
3. Actionable solutions and recommendations to complete this task effectively
4. Best practices or tips related to this type of task
5. Any clarifications or questions that might help the user better understand or approach this task

Format your response in a clear, concise, and actionable manner. Use bullet points where appropriate.`;

    if (question) {
      prompt += `\n\nUser's specific question: ${question}\n\nPlease address this question specifically in your response.`;
    }

    console.log('📤 Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Received response from Gemini');
    return text;
  } catch (error) {
    console.error('❌ Error analyzing task with Gemini:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Provide more helpful error messages
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid API key. Please check your VITE_GEMINI_API_KEY in the .env file.');
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Failed to analyze task: ${error.message || 'Unknown error'}`);
    }
  }
};

/**
 * Get suggestions for breaking down a complex task into smaller subtasks
 * @param {Object} task - The task object
 * @returns {Promise<Array>} Array of suggested subtasks
 */
export const suggestSubtasks = async (task) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this task and suggest 3-5 smaller, actionable subtasks that would help complete it:

Task: ${task.title}
Description: ${task.description || 'No description'}

Return your response as a JSON array of objects, each with "title" and "description" fields. Only return the JSON, no other text.
Example format: [{"title": "Subtask 1", "description": "Description 1"}, {"title": "Subtask 2", "description": "Description 2"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback: parse the entire response as JSON
    return JSON.parse(text);
  } catch (error) {
    console.error('Error suggesting subtasks:', error);
    throw new Error(`Failed to suggest subtasks: ${error.message}`);
  }
};

/**
 * Answer a specific question about a task
 * @param {Object} task - The task object
 * @param {string} question - The user's question
 * @returns {Promise<string>} AI-generated answer
 */
export const answerQuestion = async (task, question) => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on this task, answer the user's question:

Task: ${task.title}
Description: ${task.description || 'No description'}
Priority: ${task.priority}
Status: ${task.status}
Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}

User's Question: ${question}

Provide a clear, helpful, and specific answer. If the question cannot be answered based on the task information alone, suggest what additional information might be needed.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error answering question:', error);
    throw new Error(`Failed to answer question: ${error.message}`);
  }
};

