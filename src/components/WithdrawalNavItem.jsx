import classNames from "classnames"
import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { ADMIN_KEY } from "../lib/constants";
import { BASE_URL, withdrawalRequests } from "../states";
import { useRecoilState } from "recoil";

export default function WithdrawalNavItem({ text, to, handleClick, children }) {
	const location = useLocation();
	const navigate = useNavigate();
	const [requests, setRequests] = useRecoilState(withdrawalRequests)

	const isCurrentPath = () => {
		const paths = location.pathname.split("/")
		return paths.includes(to);
	}

	const getRequests = useCallback(async () => {
		const token = localStorage.getItem(ADMIN_KEY);

		const res = await fetch(`${BASE_URL}/admin/withdrawal_requests?status=pending`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (res.status === 200) {
			const data = await res.json();
			setRequests(data.requests)
		}
	}, [])

	useEffect(() => {
		if (to !== "withdrawal_requests") {
			return;
		}
		const interval = setInterval(getRequests, 10000);

		return () => clearInterval(interval)
	}, [])

	return (

		<div className={
			classNames('hover:border-gray-200', 'p-3', 'rounded-md', 'relative', 'hover:shadow-md', 'flex', 'gap-2', 'duration-200', "border-white", "border", {
				"bg-blue-600": isCurrentPath(),
				"text-white": isCurrentPath()
			})
		} onClick={() => {
			navigate(to);
			handleClick();
		}}>
			{children}
			<span className="text-lg">{text}</span>

			{
				requests.length > 0 && <span className="absolute bg-red-500 text-white flex justify-center items-center p-2 font-bold w-6 h-6 rounded-full top-1 right-1 text-sm">{requests.length > 9 ? '9+' : requests.length}</span>
			}
		</div>


	)
}