import React from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ur', name: 'Urdu' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'or', name: 'Odia' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'mai', name: 'Maithili' },
  { code: 'sat', name: 'Santali' },
  { code: 'ks', name: 'Kashmiri' },
  { code: 'ne', name: 'Nepali' },
  { code: 'kok', name: 'Konkani' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'doi', name: 'Dogri' },
  { code: 'mni', name: 'Manipuri' },
  { code: 'brx', name: 'Bodo' },
];

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div className="flex flex-col items-center">
      <label htmlFor="language-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Select Target Language
      </label>
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => {
          console.log("Dropdown changed to:", e.target.value);
          onLanguageChange(e.target.value);
        }}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 p-3"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector; 