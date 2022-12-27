import axios from 'axios';
import { showAlert } from './alerts';

/*eslint-disable*/
const stripe = Stripe(
  'pk_test_51MDnFVInuCLRAOs3PLLd8lB6jaF9BEgotCHj5RoWnlmx67kOISjoMoCl824SWFddBpUxJVceI7p8dkNw8WqqX8t7001Y8j5kdO'
);

export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
