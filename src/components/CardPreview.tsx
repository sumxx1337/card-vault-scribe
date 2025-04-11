
import React from 'react';
import { CardData } from '@/utils/cardUtils';

interface CardPreviewProps {
  cardData: CardData;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData }) => {
  // Display placeholder text if fields are empty
  const cardNumber = cardData.cardNumber || '•••• •••• •••• ••••';
  const cardHolder = cardData.cardHolder || 'FULL NAME';
  const expiryDate = cardData.expiryDate || 'MM/YY';

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-card-gradient-from to-card-gradient-to rounded-xl shadow-lg p-6 text-white overflow-hidden">
        {/* Card decorative elements */}
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-yellow-400 opacity-70"></div>
          <div className="w-7 h-7 rounded-full bg-red-500 opacity-60 -ml-3"></div>
        </div>
        
        <div className="absolute top-8 left-6">
          <div className="w-12 h-9 bg-card-accent opacity-30 rounded"></div>
        </div>
        
        {/* Card number */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 w-full pr-12">
          <div className="font-mono text-2xl tracking-wider mb-6">
            {cardNumber}
          </div>
          
          {/* Card holder & expiry */}
          <div className="flex justify-between items-center w-full max-w-[300px]">
            <div>
              <div className="text-xs text-gray-300 mb-1">CARD HOLDER</div>
              <div className="font-mono uppercase tracking-wider">{cardHolder}</div>
            </div>
            <div>
              <div className="text-xs text-gray-300 mb-1">EXPIRES</div>
              <div className="font-mono">{expiryDate}</div>
            </div>
          </div>
        </div>
        
        {/* Card background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute h-40 w-[200%] bg-white/10 rounded-full"
              style={{ 
                top: `${i * 25}%`, 
                left: '-50%', 
                transform: `rotate(${i * 10}deg)` 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
