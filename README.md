"The eBook Store"

Simple 'store' that has a react front end and node back end configured using "create-react-app". Customers can enter their email and payment information to 'purchase' an ebook. The payment is processed using Stripe's PaymentIntent.

## To use this application:

1. Build the application

```npm install```

 2. Run the application

```npm start```

3. Go to [localhost:3000/](localhost:3000/)

4. Enter in a 'payment' using sample card details:

    4242 4242 4242 4242 and a date in the future, any 3 digit security code and a valid zip code.

    ---> this should just work and show you a succesful payment

    4000 0027 6000 3184  and a date in the future, any 3 digit security code and a valid zip code.

    ---> this will show you a prompt to verify the payment

5. To validate that a succesful payment will be logged, use webhooks & the Stripe CLI:

    First install the Stripe CLI from here: https://stripe.com/docs/stripe-cli

    In a new terminal window, enter: ```stripe listen --forward-to http://localhost:4242/webhook```

    In another new terminal window, enter: ```stripe trigger payment_intent.succeeded```

    check in log.txt to see an entry for each time the trigger above command is sent.

any questions? email jeewan@outlook.com
