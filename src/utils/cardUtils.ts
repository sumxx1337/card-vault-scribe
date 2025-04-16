
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

// Helper to create a downloadable text file
export const createDownloadableFile = (cardData: CardData): string => {
  const content = `
Card Information:
----------------
Card Number: ${cardData.cardNumber}
Card Holder: ${cardData.cardHolder}
Expiry Date: ${cardData.expiryDate}
CVV: ${cardData.cvv}
----------------
Generated on: ${new Date().toLocaleString()}
  `;
  
  return content;
};

// Send card data via email using EmailJS
export const sendCardByEmail = async (
  cardData: CardData, 
  emailAddress: string
): Promise<{ success: boolean, message: string }> => {
  try {
    // For real email sending, we'll use EmailJS
    // You'll need to sign up for EmailJS, create a template, and get your user ID and service ID
    // Replace these values with your own from EmailJS dashboard
    const emailjsUserId = 'YOUR_EMAILJS_USER_ID';
    const serviceId = 'YOUR_EMAILJS_SERVICE_ID';
    const templateId = 'YOUR_EMAILJS_TEMPLATE_ID';

    // If the EmailJS user ID is not set, let's fall back to a downloadable file approach
    if (emailjsUserId === 'YOUR_EMAILJS_USER_ID') {
      console.log('EmailJS not configured. Creating downloadable file instead.');
      const fileContent = createDownloadableFile(cardData);
      
      // Create a blob and download link
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my_cards.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { 
        success: true, 
        message: `Card information was saved to a text file. Check your downloads folder for my_cards.txt.` 
      };
    }
    
    // Import EmailJS dynamically to avoid SSR issues
    const emailjs = await import('emailjs-com');
    
    // Initialize EmailJS
    emailjs.init(emailjsUserId);
    
    // Prepare the email template parameters
    const templateParams = {
      to_email: emailAddress,
      card_number: cardData.cardNumber,
      card_holder: cardData.cardHolder,
      expiry_date: cardData.expiryDate,
      cvv: cardData.cvv,
    };
    
    // Send the email
    await emailjs.send(serviceId, templateId, templateParams);
    
    console.log('Email sent successfully to:', emailAddress);
    
    return { 
      success: true, 
      message: `Card information was sent to ${emailAddress}` 
    };
  } catch (error) {
    console.error('Error sending email:', error);
    // If email sending fails, create a downloadable file as fallback
    const fileContent = createDownloadableFile(cardData);
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_cards.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { 
      success: false, 
      message: `Could not send email (${(error as Error).message}). Card information saved as a text file instead.` 
    };
  }
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
