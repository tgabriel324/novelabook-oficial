
import { CardElement } from "@stripe/react-stripe-js";
import { Label } from "@/components/ui/label";

interface StripeCardElementProps {
  onChange?: (event: any) => void;
}

const StripeCardElement = ({ onChange }: StripeCardElementProps) => {
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="card-element">Dados do Cartão</Label>
      <div className="border border-input rounded-md p-3 bg-background">
        <CardElement id="card-element" options={cardElementOptions} onChange={onChange} />
      </div>
    </div>
  );
};

export default StripeCardElement;
