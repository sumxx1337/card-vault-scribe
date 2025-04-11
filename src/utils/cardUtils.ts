
export interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

// Format card number with spaces (e.g., 1234 5678 9012 3456)
export const formatCardNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  const groups = [];
  
  for (let i = 0; i < digitsOnly.length; i += 4) {
    groups.push(digitsOnly.slice(i, i + 4));
  }
  
  return groups.join(' ');
};

// Format expiry date as MM/YY
export const formatExpiryDate = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  
  if (digitsOnly.length > 2) {
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
  }
  
  return digitsOnly;
};

// Validate card number using Luhn algorithm (basic check)
export const isCardNumberValid = (cardNumber: string): boolean => {
  const digitsOnly = cardNumber.replace(/\D/g, '');
  return digitsOnly.length >= 13 && digitsOnly.length <= 19;
};

// Validate expiry date
export const isExpiryDateValid = (expiryDate: string): boolean => {
  const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!pattern.test(expiryDate)) return false;
  
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);
  
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
};

// Save card data to a text file
export const saveCardToFile = (cardData: CardData): void => {
  const text = `Card Info:
Card Number: ${cardData.cardNumber}
Card Holder: ${cardData.cardHolder}
Expiry Date: ${cardData.expiryDate}
CVV: ${cardData.cvv}
---------------------
`;

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'my_cards.txt';
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

// Get card type based on first digits
export const getCardType = (cardNumber: string): string => {
  const firstDigit = cardNumber.charAt(0);
  const firstTwoDigits = cardNumber.substring(0, 2);
  
  if (firstDigit === '4') return 'Visa';
  if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'MasterCard';
  if (['34', '37'].includes(firstTwoDigits)) return 'American Express';
  if (['60', '65'].includes(firstTwoDigits)) return 'Discover';
  
  return 'Unknown';
};
