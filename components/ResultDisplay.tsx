import React from 'react';
import type { OutfitResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultDisplayProps {
  result: OutfitResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full animate-slide-in-fade">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main model image */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-800 mb-3">{t('results.modelViewTitle')}</h3>
          <div className="bg-slate-200 rounded-xl overflow-hidden shadow-inner aspect-[3/4] flex items-center justify-center">
              <img
                  src={result.modelImageUrl}
                  alt={t('results.modelViewTitle')}
                  className="w-full h-full object-cover"
              />
          </div>
        </div>
        
        {/* Items and description */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{t('results.itemsViewTitle')}</h3>
                <div className="bg-slate-200 rounded-xl overflow-hidden shadow-inner aspect-square flex items-center justify-center">
                    <img
                        src={result.itemsImageUrl}
                        alt={t('results.itemsViewTitle')}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{t('results.title')}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                    {result.description}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;