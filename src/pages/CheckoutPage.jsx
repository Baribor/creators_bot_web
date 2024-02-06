import { useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Loader from '../components/Loader';

const Checkout = () => {
	const handleCheckout = async () => {

		const params = new URLSearchParams(location.search);
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
