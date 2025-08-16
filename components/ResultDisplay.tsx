
import React from 'react';
import type { OutfitResult } from '../types';

interface ResultDisplayProps {
  result: OutfitResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-inner mb-6 aspect-[3/4] flex items-center justify-center">
            <img
                src={result.imageUrl}
                alt="Generated Outfit"
                className="w-full h-full object-cover"
            />
        </div>
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Style Breakdown</h3>
            <p className="text-gray-600 leading-relaxed">
                {result.description}
            </p>
        </div>
    </div>
  );
};

export default ResultDisplay;
