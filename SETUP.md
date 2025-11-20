# Setup Instructions

## Gemini API Key Configuration

To use the AI features in this task manager, you need to set up a Google Gemini API key.

### Step 1: Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or use an existing key
4. Copy your API key

### Step 2: Configure the API Key

1. Create a `.env` file in the root directory of the project
2. Add the following line:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key

### Step 3: Restart the Development Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

### Important Notes

- The `.env` file is already included in `.gitignore` to keep your API key secure
- Never commit your `.env` file to version control
- The API key is only used client-side for making requests to Google's Gemini API
- Make sure to keep your API key secure and don't share it publicly

### Troubleshooting

If you see an error about the API key:
1. Make sure the `.env` file is in the root directory (same level as `package.json`)
2. Make sure the variable name is exactly `VITE_GEMINI_API_KEY`
3. Restart the development server after creating/modifying the `.env` file
4. Check that there are no extra spaces or quotes around your API key

