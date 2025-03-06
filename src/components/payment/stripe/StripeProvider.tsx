
import { ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Coloque a chave pública do Stripe (este é um exemplo de chave de teste)
const stripePromise = loadStripe("pk_test_51PMLKvLBDRyv5pCXAm4RWgWpqK2nvpmvdlMqL1sRSR02v6YWmpXjqgwGk1Lqt0iJ5cV6lXxUqQOvyLLQxcvDlqIT00wXfgRK7O");

interface StripeProviderProps {
  children: ReactNode;
}

const StripeProvider = ({ children }: StripeProviderProps) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
