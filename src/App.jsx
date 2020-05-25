import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./App.css";

const promise = loadStripe("pk_test_3q0IbV0OfSSi1ybXJMTvjiqA00Oir5c4Az");

export default function App() {
  return (
    <div className="App">
      <Elements stripe={promise}>
          <CheckoutForm />
      </Elements>
    </div>
  );
}