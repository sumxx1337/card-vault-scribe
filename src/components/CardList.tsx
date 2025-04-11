
import React from 'react';
import { CardData, getCardType } from '@/utils/cardUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CardListProps {
  cards: CardData[];
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
  if (cards.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-lg">Saved Cards</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[240px] pr-4">
          <div className="space-y-4">
            {cards.map((card, index) => {
              // Display only last 4 digits of card number
              const lastFourDigits = card.cardNumber.replace(/\s/g, '').slice(-4);
              const maskedNumber = `•••• •••• •••• ${lastFourDigits}`;
              const cardType = getCardType(card.cardNumber);
              
              return (
                <div 
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{card.cardHolder}</span>
                    <span className="text-xs text-gray-500">{cardType}</span>
                  </div>
                  
                  <div className="font-mono text-sm">{maskedNumber}</div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Expires: {card.expiryDate}</span>
                    <span>CVV: ••••</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CardList;
