# VoiceBridge

VoiceBridge is a real-time speech recognition and translation app designed to break language barriers, especially for Indian languages. Speak in one language and instantly see and (for English/Hindi) hear the translation in another.

## Features

- Real-time speech recognition (browser-based)
- Input & target language selection (English + 21 Indian languages)
- Google Translate integration for accurate translations
- Audio output for English and Hindi translations
- Modern, responsive UI with card-based layout
- System-based dark/light mode (no toggle needed)
- Privacy-friendly: speech recognition happens in your browser

## Technology Stack
- **Frontend:** React, TailwindCSS
- **Backend:** FastAPI, Python, Uvicorn
- **Translation:** Google Translate API

## Getting Started (Local)

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Google Cloud credentials for Translate API

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/voicebridge.git
   cd voicebridge
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account.json"
   uvicorn main:app --reload --port 8001
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Deployment on Render

1. **Push your code to GitHub.**
2. **Create two Render services:**
   - **Backend:** Web Service, root directory `backend`, use Dockerfile or `uvicorn main:app --host 0.0.0.0 --port 8000`.
   - **Frontend:** Static Site, root directory `frontend`, build command `npm install && npm run build`, publish directory `build`.
3. **Set environment variables:**
   - For backend: `GOOGLE_APPLICATION_CREDENTIALS` (use Render's Secret Files for your Google JSON key)
   - For frontend: `REACT_APP_API_URL` (set to your backend Render URL)
4. **Update CORS in backend to allow your frontend Render URL.**
5. **Deploy and test!**

## How to Use
1. Select the language you will speak in and the target language for translation.
2. Click **Start Listening** and speak your phrase.
3. The app will automatically stop listening when you pause, transcribe your speech, and show the translation.
4. For English and Hindi translations, click **Play Translation** to hear the result.


---
VoiceBridge is open source and built with React, FastAPI, and Google Translate. 