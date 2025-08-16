
import React, { useState, useCallback } from 'react';
import { GENDERS, OCCASIONS, STYLES } from './constants';
import type { OutfitGenerationParams, OutfitResult } from './types';
import { generateOutfit } from './services/geminiService';
import Selector from './components/Selector';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [style, setStyle] = useState<string>(STYLES[0].value);
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0].value);
  const [gender, setGender] = useState<string>(GENDERS[0].value);
  const [keyGarment, setKeyGarment] = useState<string>('');
  const [colorPalette, setColorPalette] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OutfitResult | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const params: OutfitGenerationParams = {
      style,
      occasion,
      gender,
      keyGarment,
      colorPalette,
    };

    try {
      const outfitResult = await generateOutfit(params);
      setResult(outfitResult);
    } catch (err) {
      console.error(err);
      setError('Failed to generate outfit. The model may be busy. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [style, occasion, gender, keyGarment, colorPalette]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Fashion Design <span className="text-indigo-600">Co-pilot</span>
          </h1>
          <p className="text-gray-600 mt-1">Your personal AI stylist for any occasion</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-gray-800">Describe Your Vision</h2>
            <div className="space-y-6">
              <Selector label="Fashion Style" value={style} onChange={(e) => setStyle(e.target.value)} options={STYLES} />
              <Selector label="Occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} options={OCCASIONS} />
              <Selector label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} options={GENDERS} />

              <div>
                <label htmlFor="keyGarment" className="block text-sm font-medium text-gray-700 mb-1">
                  Key Garment or Item
                </label>
                <input
                  type="text"
                  id="keyGarment"
                  value={keyGarment}
                  onChange={(e) => setKeyGarment(e.target.value)}
                  placeholder="e.g., black leather jacket"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label htmlFor="colorPalette" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Colors (Optional)
                </label>
                <input
                  type="text"
                  id="colorPalette"
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  placeholder="e.g., earthy tones, pastels"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Designing...
                    </>
                ) : "Generate Outfit"}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 min-h-[600px] flex flex-col justify-center items-center">
              {isLoading && <LoadingSpinner />}
              {error && <p className="text-red-500 text-center">{error}</p>}
              {!isLoading && !error && result && <ResultDisplay result={result} />}
              {!isLoading && !error && !result && (
                <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M18.364 18.364A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m-8-9H2m18 0h-2m-2.828-5.172l-1.414-1.414M6.828 6.828L5.414 5.414m12.728 12.728l-1.414 1.414M6.828 17.172l-1.414-1.414" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">Your Outfit Awaits</h3>
                  <p className="mt-2">Fill in the details on the left and let AI create your perfect look.</p>
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
