import React, { useState, useCallback, useMemo } from 'react';
import { GENDER_KEYS, OCCASION_KEYS, STYLE_KEYS, KEY_GARMENT_KEYS } from './constants';
import type { OutfitGenerationParams, OutfitResult, SelectorOption } from './types';
import { generateOutfit } from './services/geminiService';
import Selector from './components/Selector';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import { en as enLocale } from './locales/en';

const App: React.FC = () => {
  const { t, locale } = useLanguage();

  const STYLES: SelectorOption[] = useMemo(() => STYLE_KEYS.map(key => ({
    label: t(`styles.${key}`), value: key 
  })), [t]);

  const OCCASIONS: SelectorOption[] = useMemo(() => OCCASION_KEYS.map(key => ({
    label: t(`occasions.${key}`), value: key
  })), [t]);

  const GENDERS: SelectorOption[] = useMemo(() => GENDER_KEYS.map(key => ({
    label: t(`genders.${key}`), value: key
  })), [t]);

  const KEY_GARMENTS: SelectorOption[] = useMemo(() => KEY_GARMENT_KEYS.map(key => ({
    label: t(`keyGarments.${key}`), value: key
  })), [t]);
  
  const [style, setStyle] = useState<string>(STYLE_KEYS[0]);
  const [occasion, setOccasion] = useState<string>(OCCASION_KEYS[0]);
  const [gender, setGender] = useState<string>(GENDER_KEYS[0]);
  const [keyGarmentSelection, setKeyGarmentSelection] = useState<string>(KEY_GARMENT_KEYS[0]);
  const [customKeyGarment, setCustomKeyGarment] = useState<string>('');
  const [colorPalette, setColorPalette] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OutfitResult | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const getGarmentInEnglish = (selection: string): string => {
      if (selection === 'None' || selection === 'Other') return '';
      const garments = enLocale.keyGarments as Record<string, string>;
      return garments[selection] || selection;
    };
    
    const keyGarment = keyGarmentSelection === 'Other' 
      ? customKeyGarment 
      : getGarmentInEnglish(keyGarmentSelection);

    const params: OutfitGenerationParams = {
      style,
      occasion,
      gender,
      keyGarment,
      colorPalette,
    };

    try {
      const outfitResult = await generateOutfit(params, locale);
      setResult(outfitResult);
    } catch (err) {
      console.error(err);
      setError(t('results.error'));
    } finally {
      setIsLoading(false);
    }
  }, [style, occasion, gender, keyGarmentSelection, customKeyGarment, colorPalette, locale, t]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="bg-transparent">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {t('header.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">{t('header.titleHighlight')}</span>
            </h1>
            <p className="text-slate-500 mt-1">{t('header.subtitle')}</p>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">{t('controls.title')}</h2>
            <div className="space-y-6">
              <Selector label={t('controls.style')} value={style} onChange={(e) => setStyle(e.target.value)} options={STYLES} />
              <Selector label={t('controls.occasion')} value={occasion} onChange={(e) => setOccasion(e.target.value)} options={OCCASIONS} />
              <Selector label={t('controls.gender')} value={gender} onChange={(e) => setGender(e.target.value)} options={GENDERS} />

              <div>
                <Selector 
                  label={t('controls.keyGarment')} 
                  value={keyGarmentSelection} 
                  onChange={(e) => {
                    const value = e.target.value;
                    setKeyGarmentSelection(value);
                    if (value !== 'Other') {
                      setCustomKeyGarment('');
                    }
                  }} 
                  options={KEY_GARMENTS} 
                />
                {keyGarmentSelection === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      id="customKeyGarment"
                      value={customKeyGarment}
                      onChange={(e) => setCustomKeyGarment(e.target.value)}
                      placeholder={t('controls.keyGarmentPlaceholder')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 focus:border-transparent transition duration-300 ease-in-out"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="colorPalette" className="block text-sm font-semibold text-slate-600 mb-2">
                  {t('controls.colors')}
                </label>
                <input
                  type="text"
                  id="colorPalette"
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  placeholder={t('controls.colorsPlaceholder')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-violet-400 focus:border-transparent transition duration-300 ease-in-out"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center"
              >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('controls.buttonLoading')}
                    </>
                ) : t('controls.button')}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 min-h-[600px] flex flex-col justify-center">
              {isLoading && <LoadingSpinner />}
              {error && <p className="text-red-500 font-semibold text-center">{error}</p>}
              {!isLoading && !error && result && <ResultDisplay result={result} />}
              {!isLoading && !error && !result && (
                <div className="text-center text-gray-500 self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 01-3.388-1.62m-1.622-3.385a15.998 15.998 0 013.388 1.622m-5.043-.025a15.998 15.998 0 00-1.622 3.385m-3.388-1.622a15.998 15.998 0 003.388 1.622m0 0a15.998 15.998 0 01-3.388 1.622m5.043.025a15.998 15.998 0 00-1.622-3.385" />
                    </svg>
                  <h3 className="mt-4 text-xl font-semibold text-slate-700">{t('results.initialTitle')}</h3>
                  <p className="mt-2 text-slate-500">{t('results.initialMessage')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;