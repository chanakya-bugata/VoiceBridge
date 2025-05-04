import React from 'react';

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4 transition-colors duration-500">
    <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-8 text-gray-800 dark:text-gray-200">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight animate-pulse">
          About VoiceBridge
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Speak in one language, hear in another. Seamless voice translation.
        </p>
      </div>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Real-time Speech Recognition:</strong> Speak in your chosen input language and see your words transcribed live.</li>
        <li><strong>Input & Target Language Selection:</strong> Choose the language you will speak in and the language you want to translate to. Supports English and 21 Indian languages.</li>
        <li><strong>Google Translate Integration:</strong> Translates your speech to the selected target language using Google's translation API.</li>
        <li><strong>Audio Output:</strong> For English and Hindi translations, you can listen to the translated text using your browser's speech synthesis.</li>
        <li><strong>Modern UI:</strong> Clean, responsive design with card-based layout and clear controls.</li>
        <li><strong>Dark/Light Mode:</strong> The app automatically adapts to your system's color scheme for comfortable use day or night.</li>
        <li><strong>Privacy-Friendly:</strong> All speech recognition happens in your browser; only the text is sent to the backend for translation.</li>
      </ul>
      <div>
        <p className="font-semibold">How to use:</p>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Select the language you will speak in and the target language for translation.</li>
          <li>Click <span className="font-semibold text-indigo-600 dark:text-indigo-300">Start Listening</span> and speak your phrase.</li>
          <li>The app will automatically stop listening when you pause, transcribe your speech, and show the translation.</li>
          <li>For English and Hindi translations, click <span className="font-semibold text-indigo-600 dark:text-indigo-300">Play Translation</span> to hear the result.</li>
        </ol>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        VoiceBridge is open source and built with React, FastAPI, and Google Translate. <br />
        © {new Date().getFullYear()} VoiceBridge
      </p>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
    </div>
  </div>
);

export default About;