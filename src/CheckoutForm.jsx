import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [emailAddress, setEmail] = useState('');
  

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    window
      .fetch("/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({items: [{ id: "item" }]})
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      });
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: "#3a4c94",
        fontFamily: 'Roboto, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#3a4c94"
        }
      },
      invalid: {
        color: "#d62f2f",
        iconColor: "#d62f2f"
      }
    }
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      receipt_email: emailAddress,
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: emailAddress
        }
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <div>
          <h1>The eBook Store</h1>
          <p> This is the place to buy an ebook for only $10! Submit your email and credit card info below.</p>
          <div className="content">
            <form id="payment-form" onSubmit={handleSubmit}>
              <input
              type="text"
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
            <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
              <button
              disabled={processing || disabled || succeeded}
              id="submit"
            >
              <span id="button-text">
                {processing ? (
                  <div className="spinner" id="spinner"></div>
              ) : (
                "Pay $10"
              )}
            </span>
          </button>
          {/* Show error to the end user */}
          {error && (
            <div className="card-error" role="alert">
              {error}
            </div>
          )}
          {/* Show a success to the end user */}
          <p className={succeeded ? "result-message" : "result-message hidden"}>
            Payment succeeded, you will get your ebook via email soon!
            Refresh the page to buy it again.
          </p>
        </form>
      </div>
    </div>
  );
}
