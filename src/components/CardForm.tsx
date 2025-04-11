
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  CardData, 
  formatCardNumber, 
  formatExpiryDate, 
  isCardNumberValid, 
  isExpiryDateValid,
  saveCardToFile
} from '@/utils/cardUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface CardFormProps {
  setCardData: (data: CardData) => void;
  onSave: (data: CardData) => void;
}

const CardForm: React.FC<CardFormProps> = ({ setCardData, onSave }) => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<CardData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Apply formatting based on field type
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      // Only allow up to 4 digits for CVV
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    const newFormState = { ...formState, [name]: formattedValue };
    setFormState(newFormState);
    setCardData(newFormState);
    
    // Clear error for this field when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = (): boolean => {
    const newErrors = {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    };
    
    let isValid = true;
    
    // Validate card number
    if (!formState.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
      isValid = false;
    } else if (!isCardNumberValid(formState.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
      isValid = false;
    }
    
    // Validate card holder
    if (!formState.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
      isValid = false;
    }
    
    // Validate expiry date
    if (!formState.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
      isValid = false;
    } else if (!isExpiryDateValid(formState.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date';
      isValid = false;
    }
    
    // Validate CVV
    if (!formState.cvv) {
      newErrors.cvv = 'CVV is required';
      isValid = false;
    } else if (formState.cvv.length < 3) {
      newErrors.cvv = 'CVV must be at least 3 digits';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      saveCardToFile(formState);
      onSave(formState);
      toast({
        title: "Card Saved",
        description: "Your card information has been saved to my_cards.txt",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formState.cardNumber}
                onChange={handleInputChange}
                maxLength={19}
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && (
                <p className="text-sm text-red-500">{errors.cardNumber}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Card Holder</Label>
              <Input
                id="cardHolder"
                name="cardHolder"
                placeholder="John Doe"
                value={formState.cardHolder}
                onChange={handleInputChange}
                className={errors.cardHolder ? "border-red-500" : ""}
              />
              {errors.cardHolder && (
                <p className="text-sm text-red-500">{errors.cardHolder}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formState.expiryDate}
                  onChange={handleInputChange}
                  maxLength={5}
                  className={errors.expiryDate ? "border-red-500" : ""}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-500">{errors.expiryDate}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formState.cvv}
                  onChange={handleInputChange}
                  maxLength={4}
                  className={errors.cvv ? "border-red-500" : ""}
                  type="password"
                />
                {errors.cvv && (
                  <p className="text-sm text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full bg-card-gradient-from hover:bg-card-gradient-to">
            Save Card Information
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CardForm;
