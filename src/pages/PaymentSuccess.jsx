import { useEffect } from "react"
import Success from "../assets/success.svg"


const PaymentSuccess = () => {
	useEffect(() => {
		setTimeout(async () => {
			window.Telegram.WebApp.close()
		}, 3000)
	}, [])

	return (
		<div className="flex flex-col justify-center items-center h-screen gap-2">
			<img src={Success} alt="" className="w-[120px]" />
			<h2 className="text-lg font-bold font-[cursive]">Payment successful</h2>
		</div>
	)
}

export default PaymentSuccess