const express = require("express");
const app = express();
const { resolve } = require("path");
// This is your real test secret API key.
const stripe = require("stripe")("sk_test_bEyz7xRZqy5pL7JKbWoH6pjb00SZlU6gWJ");
const endpointSecret = 'whsec_Kq2xGa0W0wJCSSzPSKZAQxVKTVoGujdR';

let fs = require('fs');

app.use(require('body-parser').text({type: '*/*'}));
app.use(express.static("."));
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with $10 USD
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    metadata: {integration_check: 'accept_a_payment'},
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.post('/webhook', function(request, response) {
  const sig = request.headers['stripe-signature'];
  const body = request.body;

  let event = null;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    // invalid signature
    response.status(400).end();
    return;
  }

  // Handle the event
  let intent = null;
  switch (event['type']) {
    case 'payment_intent.succeeded':
      intent = event.data.object;
      console.log('PaymentIntent was successful!', intent.id);
      //log the successful purchase in log.txt
      fs.appendFile('log.txt', 'paymentIntent was successful for email: ' + intent.receipt_email + '\n', (err) => {
        if (err) throw err;
        console.log('The customer data was appended to file!');
      });
      break;
    // ... handle other event types
  }
  // Return a 200 response to acknowledge receipt of the event
  response.sendStatus(200);
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
