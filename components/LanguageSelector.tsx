
import React from 'react';
import { useLanguage, Locale, locales } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();

  const languageOptions: { value: Locale, label: string }[] = [
    { value: 'en', label: t('languages.english') },
    { value: 'zh', label: t('languages.chinese') },
    { value: 'fr', label: t('languages.french') },
    { value: 'de', label: t('languages.german') },
    { value: 'ja', label: t('languages.japanese') },
    { value: 'ko', label: t('languages.korean') },
    { value: 'ru', label: t('languages.russian') },
  ];

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="appearance-none w-full md:w-40 bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-700 font-semibold py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition duration-300 ease-in-out cursor-pointer"
        aria-label="Select language"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;