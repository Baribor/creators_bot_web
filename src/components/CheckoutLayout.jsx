import { Helmet } from "react-helmet"
import { Outlet } from "react-router-dom"


const CheckoutLayout = () => {
	return (
		<>
			<Helmet>
				<script src="https://telegram.org/js/telegram-web-app.js"></script>
			</Helmet>
			<Outlet />
		</>
	)
}

export default CheckoutLayout;