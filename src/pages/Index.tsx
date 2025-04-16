
import React, { useState } from 'react';
import { CardData } from '@/utils/cardUtils';
import CardForm from '@/components/CardForm';
import CardPreview from '@/components/CardPreview';
import CardList from '@/components/CardList';

const Index = () => {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [savedCards, setSavedCards] = useState<CardData[]>([]);
  
  const handleSaveCard = (data: CardData) => {
    setSavedCards([...savedCards, { ...data }]);
    
    // Reset form after saving
    setCardData({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Card Vault</h1>
          <p className="text-gray-600">Securely send your payment card information by email</p>
        </div>
        
        <div className="flex flex-col items-center">
          <CardPreview cardData={cardData} />
          
          <CardForm 
            setCardData={setCardData} 
            onSave={handleSaveCard} 
          />
          
          <CardList cards={savedCards} />
        </div>
        
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>Your card information will be sent securely via email.</p>
          <p>No data is stored on our servers.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
