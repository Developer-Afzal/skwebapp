
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);
const endpointSecret = process.env.WEBHOOK_PAYMENT_STATUS_KEY;
const checkfeeStatus = async (request, response)=>{
    console.log(request.body);
    const sig = request.headers['stripe-signature'];
    let event;
    try {
         // Verify the signature and extract the event
         event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (error) {
        // Log the error for monitoring and debugging
    console.error(`error aaya Webhook signature verification failed: ${error}`);
    return response.status(400).send(`Webhook Error: ${error}`);
    }

      // Handle the event based on its type
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      console.log(checkoutSessionAsyncPaymentFailed.id);
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      console.log(checkoutSessionAsyncPaymentSucceeded.id);
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Checkout session completed for session ID: ${session.id}`);
      // Fulfill the purchase, update your database, etc.
      break;
      case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      console.log(checkoutSessionExpired.id);
      // Then define and call a function to handle the event checkout.session.expired
      break;
    // Add more cases to handle other relevant events
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.sendStatus(200); // Responding to acknowledge receipt of the event
}


module.exports ={ checkfeeStatus}