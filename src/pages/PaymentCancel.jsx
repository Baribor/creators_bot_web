import { useEffect } from "react";
import Cancel from "../assets/cancel.svg"

const PaymentCancel = () => {

	useEffect(() => {
		setTimeout(() => {
			window.Telegram.WebApp.close()
		}, 3000)
	}, [])
	return (
		<div className="flex flex-col justify-center items-center h-screen gap-2">
			<img src={Cancel} alt="" className="w-[120px]" />
			<h2 className="text-lg font-bold font-[cursive]">Payment cancelled</h2>
		</div>
	)
}

export default PaymentCancel;