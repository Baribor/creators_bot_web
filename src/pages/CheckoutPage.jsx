import { useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { BASE_URL } from '../states';
import Loader from '../components/Loader';

const Checkout = () => {
	const handleCheckout = async () => {
		/* const response = await fetch(BASE_URL + '/create-checkout-session?', {
			method: 'POST', body: JSON.stringify({
				price_data: {
					currency: 'eur',
					product_data: {
						name: "HeadPhone"
					},
					unit_amount: 20000,
				},
				quantity: 1
			}),

			headers: {
				'Content-Type': 'application/json'
			}
		}); */
		const params = new URLSearchParams(location.search)
		//const session = await response.json();
		const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
		const result = await stripe.redirectToCheckout({
			sessionId: params.get("sessionId"),
		});

		if (result.error) {
			console.error(result.error.message);
		}
	};

	const initCheckout = useCallback(async () => {
		handleCheckout()
	}, [])

	useEffect(() => {
		initCheckout()
	}, [])

	return (
		<div className='h-screen'>
			<Loader />
		</div>

	);
};

export default Checkout;
