
import { ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/services/payment/stripeService";
import { StripeElementsOptions } from "@stripe/stripe-js";

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

const StripeProvider = ({ children, clientSecret }: StripeProviderProps) => {
  const options: StripeElementsOptions | undefined = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  } : undefined;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
