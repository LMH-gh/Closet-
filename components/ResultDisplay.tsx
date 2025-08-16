import React from 'react';
import type { OutfitResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultDisplayProps {
  result: OutfitResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-in-fade">
        <div className="bg-slate-200 rounded-xl overflow-hidden shadow-inner mb-6 aspect-[3/4] flex items-center justify-center">
            <img
                src={result.imageUrl}
                alt="Generated Outfit"
                className="w-full h-full object-cover"
            />
        </div>
        <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('results.title')}</h3>
            <p className="text-slate-600 leading-relaxed">
                {result.description}
            </p>
        </div>
    </div>
  );
};

export default ResultDisplay;