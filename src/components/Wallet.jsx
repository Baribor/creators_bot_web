import { useRecoilState } from "recoil"
import { BASE_URL, user } from "../states"
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { enqueueSnackbar } from "notistack";
import LoadingScreen from "./LoadingScreen";
import { USER_KEY } from "../lib/constants";

export default function Wallet() {
	const [currentUser, setUser] = useRecoilState(user);
	const [expanded, setExpanded] = useState(false);
	const [loading, setLoading] = useState(false)

	const handleWithdrawal = async () => {
		if (currentUser.wallet.balance < 50) {
			enqueueSnackbar({
				message: "You must have up to €50 to withdraw", variant: "error", autoHideDuration: 2000
			})
			return
		}

		if (!currentUser.iban) {
			enqueueSnackbar({
				message: "You don't have an IBAN set. Go to settings", variant: "error", autoHideDuration: 3000
			})
			return
		}

		setLoading(true);

		const token = localStorage.getItem(USER_KEY);
		const res = await fetch(BASE_URL + "/wallet/request_withdrawal", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				amount: currentUser.wallet.balance
			})
		}).then(res => res.json())

		if (res.status) {

			enqueueSnackbar({
				message: res.message, variant: "success"
			})
			setUser({ ...currentUser, withdrawal_requests: [res.request] })

		} else {
			enqueueSnackbar({
				message: "An error occurred", variant: "error"
			})
		}

		setLoading(false)
	}

	const handleCancelRequest = async () => {
		setLoading(true)
		const token = localStorage.getItem(USER_KEY);

		const res = await fetch(BASE_URL + "/wallet/cancel_withdrawal?" + new URLSearchParams({
			request_id: currentUser.withdrawal_requests[0].id
		}), {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => res.json()).catch(err => console.log)

		if (res.status) {
			enqueueSnackbar({
				message: res.message, variant: "success", autoHideDuration: 3000
			})
			setUser({ ...currentUser, withdrawal_requests: [] })
		} else {
			enqueueSnackbar({
				message: "An error occurred", variant: "error", autoHideDuration: 3000
			})
		}

		setLoading(false)
	}

	return (
		<div className="border rounded mb-4">
			<div className="border-2 rounded overflow-hidden flex items-center w-full">
				<span className="px-3 font-bold">Balance</span>
				<span>€ {currentUser.wallet?.balance}</span>
				<div className="flex-grow text-end">
					<IconButton onClick={() => setExpanded(!expanded)}>
						{
							expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
						}
					</IconButton>
				</div>
			</div>

			<div>
				<Collapse in={expanded}>
					{
						currentUser.withdrawal_requests?.length > 0 ?
							(<div className="flex flex-col p-3">
								<span className="text-xs">You have a pending request</span>
								<Button variant="contained" color="error" onClick={handleCancelRequest}>Cancel Request</Button>
							</div>)
							:
							(<div className="flex flex-col p-3">
								<span className="text-xs">Minimum withdrawal amount is €50</span>
								<Button variant="contained" onClick={handleWithdrawal}>Request Withdrawal</Button>
							</div>)
					}


				</Collapse>
			</div>

			<LoadingScreen open={loading} />
		</div>
	)
}