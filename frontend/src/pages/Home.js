import React, { useState, useEffect, useRef } from 'react';
import LanguageSelector from '../components/LanguageSelector';

const inputLanguages = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'ur-IN', name: 'Urdu' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'or-IN', name: 'Odia' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'as-IN', name: 'Assamese' },
  { code: 'mai-IN', name: 'Maithili' },
  { code: 'sat-IN', name: 'Santali' },
  { code: 'ks-IN', name: 'Kashmiri' },
  { code: 'ne-IN', name: 'Nepali' },
  { code: 'kok-IN', name: 'Konkani' },
  { code: 'sd-IN', name: 'Sindhi' },
  { code: 'doi-IN', name: 'Dogri' },
  { code: 'mni-IN', name: 'Manipuri' },
  { code: 'brx-IN', name: 'Bodo' },
];

const Home = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);
  const transcriptRef = useRef('');
  const selectedLanguageRef = useRef(selectedLanguage);
  const [audioError, setAudioError] = useState('');
  const [inputLanguage, setInputLanguage] = useState('en-US');

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = inputLanguage;

      recognition.onstart = () => {
        setError(null);
        setTranscript('');
        setTranslation('');
        transcriptRef.current = '';
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTranscript(transcript.trim());
        transcriptRef.current = transcript.trim();
      };

      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcriptRef.current.trim()) {
          translateText(transcriptRef.current.trim());
        }
      };

      setRecognition(recognition);
    } else {
      setError('Speech recognition is not supported in your browser. Please use Chrome.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [inputLanguage]);

  const playTranslation = () => {
    if (translation) {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(translation);
      const voices = window.speechSynthesis.getVoices();
      const lang = selectedLanguageRef.current || 'en';
      let voice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang));
      if (!voice) {
        voice = voices.find(v => v.lang && v.lang.toLowerCase().includes(lang));
      }
      if (voice) {
        utterance.voice = voice;
        utterance.lang = lang;
        setAudioError('');
        window.speechSynthesis.speak(utterance);
      } else {
        setAudioError('Audio output for this language is not supported in your browser.');
      }
    }
  };

  const handleStartListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        setTranscript('');
        setTranslation('');
        setError(null);
        transcriptRef.current = '';
      } catch (err) {
        setError(`Error starting recognition: ${err.message}`);
        setIsListening(false);
      }
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (err) {
        setError(`Error stopping recognition: ${err.message}`);
      }
    }
  };

  const translateText = async (text) => {
    try {
      const targetLang = selectedLanguageRef.current;
      const response = await fetch('http://localhost:8001/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          target_lang: targetLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `Translation failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      setTranslation(data.translated_text);
      setError(null);
    } catch (error) {
      setError(`Translation error: ${error.message}`);
      setTranslation('');
    }
  };

  useEffect(() => {
    setAudioError('');
  }, [selectedLanguage, translation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight animate-pulse">
            VoiceBridge
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Speak in one language, hear in another. Seamless voice translation.
          </p>
        </div>

        {/* Language Selection */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="flex-1">
            <label htmlFor="input-language-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Speak In
            </label>
            <select
              id="input-language-select"
              value={inputLanguage}
              onChange={e => setInputLanguage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 p-3"
            >
              {inputLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={(lang) => setSelectedLanguage(lang)}
            />
          </div>
        </div>

        {/* Listening Controls */}
        <div className="flex justify-center">
          <div className={`relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1 ${isListening ? 'animate-pulse shadow-lg' : ''}`}>
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 ${
                isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <span role="img" aria-label={isListening ? 'stop' : 'microphone'}>{isListening ? '🛑' : '🎤'}</span>
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            {isListening && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-sm text-indigo-200 animate-bounce">
                Listening...
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center bg-red-100 dark:bg-red-900/30 rounded-lg p-4 text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Transcript and Translation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              <span role="img" aria-label="wave">🗣️</span> Your Speech
            </h2>
            <div className="min-h-[120px] p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
              <p className="text-gray-700 dark:text-gray-200 text-lg whitespace-pre-line break-words">
                {transcript || 'Start speaking to see your text...'}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
              <span role="img" aria-label="globe">🌐</span> Translation
            </h2>
            <div className="min-h-[120px] p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
              <p className="text-gray-700 dark:text-gray-200 text-lg whitespace-pre-line break-words">
                {translation || 'Translation will appear here...'}
              </p>
            </div>
            {['en', 'hi'].includes(selectedLanguageRef.current || selectedLanguage) && (
              <button
                onClick={playTranslation}
                disabled={!translation}
                className={`mt-4 flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
                  translation
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                }`}
              >
                <span role="img" aria-label="speaker">🔊</span> Play Translation
              </button>
            )}
            {audioError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{audioError}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400">
          VoiceBridge © {new Date().getFullYear()} — Powered by FastAPI, React, and Google Translate
        </footer>
      </div>
    </div>
  );
};

export default Home;